import { useLocation, useNavigate } from "react-router-dom";
import { getWebResults, getLandingContent } from "@/lib/storage";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useAnalyticsTracking } from "@/hooks/useAnalyticsTracking";
import { supabase } from "@/integrations/supabase/client";

const WebResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { trackLinkClick, startSession, endSession } = useAnalyticsTracking();
  const landingContent = getLandingContent();
  
  // Extract wr parameter from URL
  const wrParam = location.pathname.replace('/', '');
  
  const allResults = getWebResults();
  const sponsoredResults = allResults.filter(r => r.isSponsored && r.webResultPage === wrParam);
  const webResults = allResults.filter(r => !r.isSponsored && r.webResultPage === wrParam);

  // Session tracking
  useEffect(() => {
    startSession(wrParam);
    
    return () => {
      endSession();
    };
  }, [wrParam]);

  const ensureProtocol = (url: string) => {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return `https://${url}`;
    }
    return url;
  };

  const handleLinkClick = async (lid: number, name: string, title: string, originalLink: string, webResultId: string) => {
    // Get user's country
    let userCountry = "WW";
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      userCountry = data.country_code || "WW";
    } catch (error) {
      console.error("Failed to get country:", error);
    }

    // Try to get country-specific link
    let finalLink = originalLink;
    try {
      const { data: countryLink } = await supabase
        .from('country_links' as any)
        .select('link')
        .eq('web_result_id', webResultId)
        .eq('country_code', userCountry)
        .maybeSingle();

      if (countryLink) {
        finalLink = (countryLink as any).link;
      } else {
        // Try worldwide fallback
        const { data: worldwideLink } = await supabase
          .from('worldwide_links' as any)
          .select('link')
          .eq('web_result_id', webResultId)
          .maybeSingle();

        if (worldwideLink) {
          finalLink = (worldwideLink as any).link;
        }
      }
    } catch (error) {
      console.error("Failed to fetch country-specific link:", error);
    }

    // Track the click with the search term (wrParam)
    await trackLinkClick(lid, name, title, wrParam, false);
    const fullUrl = ensureProtocol(finalLink);
    window.open(fullUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/landing')}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold text-primary">FastMoney</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {sponsoredResults.length > 0 && (
          <section className="mb-10">
            <h2 className="text-sm text-muted-foreground mb-4">Sponsored Results</h2>
            <div className="space-y-6">
              {sponsoredResults.map((result) => (
                <div key={result.id} className="bg-card/30 rounded-lg p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {result.logoUrl ? (
                        <img src={result.logoUrl} alt={result.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-primary-foreground font-semibold text-lg">
                          {result.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-muted-foreground mb-1">Sponsored</div>
                      <button 
                        onClick={() => handleLinkClick(result.lid, result.name, result.title, result.link, result.id)}
                        className="text-xl font-semibold text-foreground hover:text-primary hover:underline block mb-1 text-left transition-colors"
                      >
                        {result.title}
                      </button>
                      <p className="text-sm text-muted-foreground mb-3">{result.description}</p>
                      <button 
                        onClick={() => handleLinkClick(result.lid, result.name, result.title, result.link, result.id)}
                        className="text-sm text-primary hover:underline"
                      >
                        topuniversityterritian/lid={result.lid}
                      </button>
                      <div className="mt-4">
                        <Button 
                          onClick={() => handleLinkClick(result.lid, result.name, result.title, result.link, result.id)}
                          className="bg-primary hover:bg-primary/90 text-primary-foreground"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Visit Website
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {webResults.length > 0 && (
          <section>
            <h2 className="text-sm text-muted-foreground mb-4">Web Results</h2>
            <div className="space-y-6">
              {webResults.map((result) => (
                <div key={result.id} className="space-y-2">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 overflow-hidden mt-1">
                      {result.logoUrl ? (
                        <img src={result.logoUrl} alt={result.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-primary-foreground font-semibold text-sm">
                          {result.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-muted-foreground mb-1">{result.name}</div>
                      <button 
                        onClick={() => handleLinkClick(result.lid, result.name, result.title, result.link, result.id)}
                        className="text-xl font-medium text-primary hover:underline block mb-1 text-left"
                      >
                        {result.title}
                      </button>
                      <p className="text-sm text-muted-foreground mb-2">{result.description}</p>
                      <button 
                        onClick={() => handleLinkClick(result.lid, result.name, result.title, result.link, result.id)}
                        className="text-sm text-primary hover:underline"
                      >
                        topuniversityterritian/lid={result.lid}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {sponsoredResults.length === 0 && webResults.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No results found for this page.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default WebResult;
