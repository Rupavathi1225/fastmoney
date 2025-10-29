import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DollarSign } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-dark">
      <div className="text-center space-y-8 px-4">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center">
            <DollarSign className="w-12 h-12 text-primary-foreground" />
          </div>
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4">
          FastMoney
        </h1>
        <p className="text-xl text-muted-foreground max-w-md mx-auto">
          Your gateway to financial opportunities and quick money-making strategies
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button 
            onClick={() => navigate('/landing')}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg"
          >
            Explore Money Tips
          </Button>
          <Button 
            onClick={() => navigate('/admin')}
            variant="outline"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-6 text-lg"
          >
            Admin Panel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
