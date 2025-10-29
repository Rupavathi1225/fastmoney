import { useNavigate } from "react-router-dom";
import { getLandingContent, getSearchButtons } from "@/lib/storage";
import { ChevronRight, Search } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();
  const landingContent = getLandingContent();
  const searchButtons = getSearchButtons().sort((a, b) => a.serialNumber - b.serialNumber);

  const handleButtonClick = (button: any) => {
    if (button.link) {
      window.open(button.link, '_blank');
    } else {
      navigate(`/${button.webResultPage}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-primary">FastMoney</h1>
            <Search className="w-5 h-5 text-muted-foreground" />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16 max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            {landingContent.title}
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {landingContent.description}
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm text-muted-foreground mb-4">Related categories</h3>
          {searchButtons.map((button) => (
            <button
              key={button.id}
              onClick={() => handleButtonClick(button)}
              className="w-full px-6 py-4 bg-card border border-border rounded-lg text-left hover:border-primary transition-all duration-200 group flex items-center justify-between"
            >
              <span className="text-foreground">{button.title}</span>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Landing;
