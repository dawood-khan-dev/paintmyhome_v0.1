/// <reference path="./basehub-types.d.ts" />
import type { QueryGenqlSelection } from "basehub";
import { basehub as basehubClient, fragmentOn } from "basehub";
import { keys } from "./keys";
import "./basehub.config";

const { BASEHUB_TOKEN } = keys();

const basehub = BASEHUB_TOKEN
  ? basehubClient({ token: BASEHUB_TOKEN })
  : undefined;

/* -------------------------------------------------------------------------------------------------
 * Common Fragments
 * -----------------------------------------------------------------------------------------------*/

const imageFragment = fragmentOn("BlockImage", {
  url: true,
  width: true,
  height: true,
  alt: true,
  blurDataURL: true,
});

/* -------------------------------------------------------------------------------------------------
 * Guide Fragments & Queries
 * -----------------------------------------------------------------------------------------------*/

const guideMetaFragment = fragmentOn("GuideComponent", {
  _slug: true,
  _title: true,
  summary: true,
  coverImage: imageFragment,
  lastUpdated: true,
});

const guideFragment = fragmentOn("GuideComponent", {
  ...guideMetaFragment,
  body: {
    plainText: true,
    json: {
      content: true,
      toc: true,
    },
    readingTime: true,
  },
});

export type GuideMeta = fragmentOn.infer<typeof guideMetaFragment>;
export type Guide = fragmentOn.infer<typeof guideFragment>;

export const guides = {
  guidesQuery: {
    guides: {
      items: guideMetaFragment,
    },
  } satisfies QueryGenqlSelection,

  latestGuideQuery: {
    guides: {
      __args: {
        orderBy: "_sys_createdAt__DESC" as const,
      },
      item: guideFragment,
    },
  } satisfies QueryGenqlSelection,

  guideQuery: (slug: string) => ({
    guides: {
      __args: {
        filter: {
          _sys_slug: { eq: slug },
        },
      },
      item: guideFragment,
    },
  }),

  homepageGuidesQuery: {
    guides: {
      __args: {
        filter: {
          tags: { includes: "homepage" },
        },
        first: 5,
      },
      items: guideMetaFragment,
    },
  } satisfies QueryGenqlSelection,

  getGuides: async (): Promise<GuideMeta[]> => {
    if (!basehub) {
      return [];
    }

    try {
      const data = await basehub.query(guides.guidesQuery);
      return data.guides.items;
    } catch {
      return [];
    }
  },

  getLatestGuide: async (): Promise<Guide | null> => {
    if (!basehub) {
      return null;
    }

    try {
      const data = await basehub.query(guides.latestGuideQuery);
      return data.guides.item;
    } catch {
      return null;
    }
  },

  getGuide: async (slug: string): Promise<Guide | null> => {
    if (!basehub) {
      return null;
    }

    try {
      const query = guides.guideQuery(slug);
      const data = await basehub.query(query);
      return data.guides.item;
    } catch {
      return null;
    }
  },

  getHomepageGuides: async (): Promise<GuideMeta[]> => {
    if (!basehub) {
      return [];
    }

    try {
      const data = await basehub.query(guides.homepageGuidesQuery);
      return data.guides.items;
    } catch {
      return [];
    }
  },
};

/* -------------------------------------------------------------------------------------------------
 * Service Fragments & Queries
 * -----------------------------------------------------------------------------------------------*/

const serviceMetaFragment = fragmentOn("ServiceComponent", {
  _slug: true,
  _title: true,
  summary: true,
  coverImage: imageFragment,
});

const serviceFragment = fragmentOn("ServiceComponent", {
  ...serviceMetaFragment,
  body: {
    plainText: true,
    json: {
      content: true,
      toc: true,
    },
    readingTime: true,
  },
});

export type ServiceMeta = fragmentOn.infer<typeof serviceMetaFragment>;
export type Service = fragmentOn.infer<typeof serviceFragment>;

export const services = {
  servicesQuery: {
    services: {
      items: serviceMetaFragment,
    },
  } satisfies QueryGenqlSelection,

  serviceQuery: (slug: string) => ({
    services: {
      __args: {
        filter: {
          _sys_slug: { eq: slug },
        },
      },
      item: serviceFragment,
    },
  }),

  getServices: async (): Promise<ServiceMeta[]> => {
    if (!basehub) {
      return [];
    }

    try {
      const data = await basehub.query(services.servicesQuery);
      return data.services.items;
    } catch {
      return [];
    }
  },

  getService: async (slug: string): Promise<Service | null> => {
    if (!basehub) {
      return null;
    }

    try {
      const query = services.serviceQuery(slug);
      const data = await basehub.query(query);
      return data.services.item;
    } catch {
      return null;
    }
  },
};
