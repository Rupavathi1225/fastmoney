import { useLocation, useNavigate } from "react-router-dom";
import { getWebResults, getLandingContent } from "@/lib/storage";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const WebResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const landingContent = getLandingContent();
  
  // Extract wr parameter from URL
  const wrParam = location.pathname.replace('/', '');
  
  const allResults = getWebResults();
  const sponsoredResults = allResults.filter(r => r.isSponsored && r.webResultPage === wrParam);
  const webResults = allResults.filter(r => !r.isSponsored && r.webResultPage === wrParam);

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
                    {result.logoUrl && (
                      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center flex-shrink-0 overflow-hidden">
                        <img src={result.logoUrl} alt={result.name} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-muted-foreground mb-1">Sponsored</div>
                      <h3 className="text-xl font-semibold text-foreground mb-1">{result.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{result.description}</p>
                      <a 
                        href={result.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        {result.link}
                      </a>
                      <div className="mt-4">
                        <Button 
                          onClick={() => window.open(result.link, '_blank')}
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
                    {result.logoUrl && (
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0 overflow-hidden mt-1">
                        <img src={result.logoUrl} alt={result.name} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-muted-foreground mb-1">{result.name}</div>
                      <a 
                        href={result.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xl font-medium text-primary hover:underline block mb-1"
                      >
                        {result.title}
                      </a>
                      <p className="text-sm text-muted-foreground mb-2">{result.description}</p>
                      <a 
                        href={result.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        {result.link}
                      </a>
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
