import { Helmet } from "react-helmet-async";

interface PageSEOProps {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  noindex?: boolean;
  ogImage?: string;
  ogType?: string;
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    section?: string;
  };
}

export function PageSEO({ 
  title, 
  description, 
  keywords,
  canonical,
  noindex = false,
  ogImage = "https://ledgerstash.com/og-image.png",
  ogType = "website",
  article,
}: PageSEOProps) {
  // Use "Ledger Stash" (two words) in titles per branding guidelines
  const fullTitle = title.includes("LedgerStash") || title.includes("Ledger Stash") 
    ? title 
    : `${title} | LedgerStash`;
  const baseUrl = "https://ledgerstash.com";
  const canonicalUrl = canonical ? `${baseUrl}${canonical}` : undefined;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      )}
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="672" />
      <meta property="og:image:alt" content={fullTitle} />
      <meta property="og:site_name" content="LedgerStash" />
      <meta property="og:locale" content="en_US" />
      
      {/* Article metadata for blog posts */}
      {article?.publishedTime && <meta property="article:published_time" content={article.publishedTime} />}
      {article?.modifiedTime && <meta property="article:modified_time" content={article.modifiedTime} />}
      {article?.section && <meta property="article:section" content={article.section} />}
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@ledgerstash" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={fullTitle} />
    </Helmet>
  );
}
