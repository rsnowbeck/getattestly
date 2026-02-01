import { useEffect } from "react";

/**
 * Adds a noindex meta tag when the site is accessed via the lovable.app domain.
 * This prevents search engines from indexing the lovable.app URL while allowing
 * the custom domain (getattestly.com) to be indexed normally.
 */
export function useNoIndexLovable() {
  useEffect(() => {
    const hostname = window.location.hostname;
    
    // Check if we're on a lovable.app domain (includes preview and published)
    if (hostname.includes("lovable.app")) {
      // Check if meta tag already exists
      const existingMeta = document.querySelector('meta[name="robots"][data-lovable-noindex]');
      if (!existingMeta) {
        const meta = document.createElement("meta");
        meta.name = "robots";
        meta.content = "noindex, nofollow";
        meta.setAttribute("data-lovable-noindex", "true");
        document.head.appendChild(meta);
      }
    }
    
    // Cleanup on unmount (though this typically won't happen for App-level hooks)
    return () => {
      const meta = document.querySelector('meta[name="robots"][data-lovable-noindex]');
      if (meta) {
        meta.remove();
      }
    };
  }, []);
}
