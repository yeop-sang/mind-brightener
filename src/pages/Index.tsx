import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, TestTube, BookOpen, Play } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-calm-green">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16 animate-fade-in">
          <div className="flex justify-center mb-6">
            <Brain className="h-16 w-16 text-science-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            과학자를 위한
            <br />
            <span className="bg-gradient-hero bg-clip-text text-transparent">
              인지편향 교정 플랫폼
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            객관적이고 과학적인 사고를 위해 자신의 인지편향을 점검하고, 
            맞춤형 콘텐츠로 편향을 교정해보세요.
          </p>
        </div>

        {/* Main Action Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          <Card className="shadow-card hover:shadow-elegant transition-all duration-300 animate-scale-in">
            <CardHeader className="text-center pb-4">
              <TestTube className="h-12 w-12 text-science-primary mx-auto mb-4" />
              <CardTitle className="text-2xl text-foreground">내 인지편향 점검하기</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-6">
                8개의 문항으로 구성된 과학적 검증 도구를 통해 
                당신의 인지편향 패턴을 정확히 진단합니다.
              </p>
              <Button 
                onClick={() => navigate('/bias-test')}
                variant="hero"
                size="lg"
                className="w-full"
              >
                지금 검사 시작하기
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-elegant transition-all duration-300 animate-scale-in" style={{animationDelay: '0.2s'}}>
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center gap-2 mb-4">
                <BookOpen className="h-12 w-12 text-science-primary" />
                <Play className="h-12 w-12 text-trust-green" />
              </div>
              <CardTitle className="text-2xl text-foreground">인지편향 벗어나기</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-6">
                웹툰과 애니메이션으로 구성된 교육 콘텐츠를 통해 
                인지편향을 이해하고 극복하는 방법을 학습합니다.
              </p>
              <div className="space-y-3">
                <Button 
                  onClick={() => navigate('/correction/확증편향')}
                  variant="science"
                  className="w-full"
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  웹툰으로 학습하기
                </Button>
                <Button 
                  onClick={() => navigate('/correction/확증편향?type=animation')}
                  variant="science"
                  className="w-full"
                >
                  <Play className="mr-2 h-4 w-4" />
                  애니메이션으로 학습하기
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="text-center animate-slide-up">
          <h2 className="text-3xl font-bold text-foreground mb-8">
            왜 인지편향 교정이 중요한가요?
          </h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="bg-science-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Brain className="h-8 w-8 text-science-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">객관적 사고</h3>
              <p className="text-muted-foreground">
                편향된 인식을 제거하여 더욱 객관적이고 정확한 판단을 내릴 수 있습니다.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-science-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <TestTube className="h-8 w-8 text-science-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">연구 품질 향상</h3>
              <p className="text-muted-foreground">
                인지편향을 인식하고 통제함으로써 연구의 신뢰성과 타당성을 높입니다.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-science-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-science-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">지속적 학습</h3>
              <p className="text-muted-foreground">
                다양한 매체를 통한 반복 학습으로 편향 교정 효과를 극대화합니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
