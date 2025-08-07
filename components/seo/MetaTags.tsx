import React, { useEffect } from 'react';

interface MetaTagsProps {
  title: string;
  description: string;
  canonicalPath?: string;
}

const BASE_URL = 'https://proevals.com'; // This should be your production domain

const MetaTags: React.FC<MetaTagsProps> = ({ title, description, canonicalPath }) => {
  useEffect(() => {
    document.title = title;

    const setMetaTag = (attr: 'name' | 'property', value: string, content: string) => {
        let element = document.querySelector(`meta[${attr}="${value}"]`) as HTMLMetaElement;
        if (!element) {
            element = document.createElement('meta');
            element.setAttribute(attr, value);
            document.head.appendChild(element);
        }
        element.setAttribute('content', content);
    };

    setMetaTag('name', 'description', description);
    
    // Open Graph Tags for social sharing
    setMetaTag('property', 'og:title', title);
    setMetaTag('property', 'og:description', description);

    // Canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
        canonicalLink = document.createElement('link');
        canonicalLink.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalLink);
    }
    // Use HashRouter-friendly canonical URLs
    const canonicalUrl = canonicalPath ? `${BASE_URL}/#${canonicalPath.startsWith('/') ? canonicalPath : '/' + canonicalPath}` : BASE_URL;
    canonicalLink.setAttribute('href', canonicalUrl);
    
    setMetaTag('property', 'og:url', canonicalUrl);

  }, [title, description, canonicalPath]);

  return null; // This component doesn't render anything
};

export default MetaTags;
