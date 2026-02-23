// JSON-LD Schema utilities for Pure Logic Solutions
// Generates structured data for Google rich results and local SEO

export const BUSINESS = {
  name: 'Pure Logic Solutions',
  legalName: 'Pure Logic Solutions LLC',
  url: 'https://purelogicsolutions.com',
  logo: 'https://purelogicsolutions.com/logo.png',
  phone: '+18019058175',
  email: 'jared@purelogicsolutions.com',
  founder: 'Jared Bayless',
  license: '14253923-5501',
  rating: 4.9,
  reviewCount: 127,
  address: {
    streetAddress: '',
    addressLocality: 'Salt Lake City',
    addressRegion: 'UT',
    postalCode: '84101',
    addressCountry: 'US',
  },
  geo: {
    latitude: 40.7608,
    longitude: -111.8910,
  },
  areaServed: [
    'Salt Lake City, UT', 'Provo, UT', 'Ogden, UT', 'Orem, UT', 'Sandy, UT',
    'Layton, UT', 'South Jordan, UT', 'Lehi, UT', 'Draper, UT', 'Herriman, UT',
    'West Jordan, UT', 'Murray, UT', 'Taylorsville, UT', 'Riverton, UT',
    'Saratoga Springs, UT', 'Eagle Mountain, UT', 'American Fork, UT',
    'Pleasant Grove, UT', 'Spanish Fork, UT', 'Springville, UT', 'Santaquin, UT',
    'Park City, UT', 'Tooele, UT', 'Bountiful, UT', 'Kaysville, UT',
    'Farmington, UT', 'Centerville, UT', 'North Salt Lake, UT',
  ],
  services: [
    'Kitchen Remodeling', 'Bathroom Remodeling', 'Basement Finishing',
    'Home Additions', 'Custom Home Builds', 'Whole Home Remodels',
    'General Contracting',
  ],
  openingHours: 'Mo-Fr 07:00-18:00',
  sameAs: [
    'https://www.google.com/maps/place/Pure+Logic+Solutions',
  ],
};

export function localBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': ['GeneralContractor', 'HomeAndConstructionBusiness', 'LocalBusiness'],
    '@id': `${BUSINESS.url}/#business`,
    name: BUSINESS.name,
    legalName: BUSINESS.legalName,
    url: BUSINESS.url,
    logo: {
      '@type': 'ImageObject',
      url: BUSINESS.logo,
    },
    telephone: BUSINESS.phone,
    email: BUSINESS.email,
    founder: {
      '@type': 'Person',
      name: BUSINESS.founder,
    },
    address: {
      '@type': 'PostalAddress',
      ...BUSINESS.address,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: BUSINESS.geo.latitude,
      longitude: BUSINESS.geo.longitude,
    },
    areaServed: BUSINESS.areaServed.map((area) => ({
      '@type': 'City',
      name: area,
    })),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Home Remodeling Services',
      itemListElement: BUSINESS.services.map((service, i) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: service,
        },
        position: i + 1,
      })),
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: BUSINESS.rating,
      reviewCount: BUSINESS.reviewCount,
      bestRating: 5,
      worstRating: 1,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '07:00',
        closes: '18:00',
      },
    ],
    priceRange: '$$-$$$',
    currenciesAccepted: 'USD',
    paymentAccepted: 'Check, Credit Card, Bank Transfer',
    sameAs: BUSINESS.sameAs,
    knowsAbout: BUSINESS.services,
    slogan: 'We Build It Like It\'s Our Own',
    description: 'Pure Logic Solutions is a premium general contractor serving the Wasatch Front in Utah. Specializing in kitchen remodeling, bathroom renovation, basement finishing, home additions, and custom home builds. Founded by Jared Bayless on the principle of integrity and transparent communication.',
  };
}

export function breadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${BUSINESS.url}${item.url}`,
    })),
  };
}

export function serviceSchema(serviceName: string, description: string, url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: serviceName,
    description,
    url: `${BUSINESS.url}${url}`,
    provider: {
      '@type': 'LocalBusiness',
      '@id': `${BUSINESS.url}/#business`,
      name: BUSINESS.name,
    },
    areaServed: {
      '@type': 'State',
      name: 'Utah',
    },
    serviceType: serviceName,
  };
}
