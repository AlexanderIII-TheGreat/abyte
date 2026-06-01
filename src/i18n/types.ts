export interface Translations {
  meta: {
    titleSuffix: string
    homeTitle: string
    homeDescription: string
    articlesTitle: string
    articlesDescription: string
    aboutTitle: string
    aboutDescription: string
  }
  nav: {
    home: string
    about: string
    author: string
    openMenu: string
    closeMenu: string
    mainNavLabel: string
  }
  hero: {
    headingPrefix: string
    headingHighlight: string
    description: string
  }
  featured: {
    badge: string
    sectionTitle: string
  }
  articles: {
    latestTitle: string
    allTitle: string
    allDescription: string
    viewAll: string
    relatedTitle: string
    craftedBy: string
    viewPortfolio: string
    breadcrumbHome: string
    breadcrumbArticles: string
  }
  categories: {
    sectionTitle: string
    emptyState: string
    names: Record<string, string>
    descriptions: Record<string, string>
  }
  newsletter: {
    title: string
    description: string
    emailLabel: string
    placeholder: string
    subscribe: string
  }
  about: {
    title: string
    missionTitle: string
    missionParagraph: string
    whatYouFindTitle: string
    whatYouFindIntro: string
    authorTitle: string
    authorParagraph1: string
    authorParagraph2: string
    connectTitle: string
    connectParagraph: string
    portfolioLabel: string
    githubLabel: string
    twitterLabel: string
    backToHome: string
  }
  notFound: {
    title: string
    description: string
    backToHome: string
  }
  error: {
    title: string
    description: string
    tryAgain: string
  }
  loading: {
    text: string
  }
  footer: {
    description: string
    categoriesLabel: string
    linksLabel: string
    authorLabel: string
    craftedBy: string
    rightsReserved: string
    about: string
    portfolio: string
    github: string
    categoryLinksLabel: string
    siteLinksLabel: string
  }
  common: {
    minRead: string
  }
}
