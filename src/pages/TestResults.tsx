import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, BookOpen, Play } from "lucide-react";

interface BiasResult {
  name: string;
  description: string;
  severity: "높음" | "보통" | "낮음";
  color: string;
}

const biasDefinitions: Record<string, BiasResult> = {
  confirmation: {
    name: "확증편향",
    description: "자신의 기존 믿음이나 가설을 지지하는 정보만 선별적으로 수집하고 해석하는 경향",
    severity: "높음",
    color: "destructive"
  },
  availability: {
    name: "가용성 편향",
    description: "최근에 경험했거나 기억하기 쉬운 사건의 가능성을 과대평가하는 경향",
    severity: "보통",
    color: "default"
  },
  anchoring: {
    name: "앵커링 편향",
    description: "처음 접한 정보에 과도하게 의존하여 후속 판단을 내리는 경향",
    severity: "보통",
    color: "secondary"
  },
  attribution: {
    name: "귀인편향",
    description: "성공은 내부 요인으로, 실패는 외부 요인으로 돌리는 자기중심적 해석 경향",
    severity: "높음",
    color: "destructive"
  },
  overconfidence: {
    name: "과신편향",
    description: "자신의 판단이나 능력을 실제보다 과대평가하는 경향",
    severity: "높음",
    color: "destructive"
  }
};

const TestResults = () => {
  const [results, setResults] = useState<BiasResult[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedResults = localStorage.getItem('biasTestResults');
    if (!savedResults) {
      navigate('/');
      return;
    }

    const answers = JSON.parse(savedResults);
    const biasScores: Record<string, number> = {};

    Object.entries(answers).forEach(([questionId, score]) => {
      const question = {
        1: "confirmation", 2: "availability", 3: "anchoring", 4: "attribution",
        5: "availability", 6: "overconfidence", 7: "confirmation", 8: "overconfidence"
      }[questionId as any];
      
      if (question) {
        biasScores[question] = (biasScores[question] || 0) + (score as number);
      }
    });

    const detectedBiases = Object.entries(biasScores)
      .filter(([_, score]) => score >= 6)
      .map(([bias, _]) => biasDefinitions[bias])
      .filter(Boolean);

    setResults(detectedBiases);
  }, [navigate]);

  if (results.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-calm-green flex items-center justify-center">
        <Card className="shadow-card animate-scale-in max-w-md w-full mx-4">
          <CardContent className="text-center py-8">
            <h2 className="text-2xl font-bold mb-4 text-foreground">축하합니다!</h2>
            <p className="text-muted-foreground mb-6">
              현재 특별히 주의해야 할 인지편향이 발견되지 않았습니다.
            </p>
            <Button onClick={() => navigate('/')} variant="hero">
              메인으로 돌아가기
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-calm-green py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            메인으로
          </Button>
          <h1 className="text-3xl font-bold text-foreground mb-2 animate-fade-in">
            진단 결과
          </h1>
          <p className="text-muted-foreground animate-fade-in">
            다음과 같은 인지편향이 발견되었습니다
          </p>
        </div>

        <div className="space-y-6">
          {results.map((bias, index) => (
            <Card key={bias.name} className="shadow-card animate-scale-in" style={{animationDelay: `${index * 0.1}s`}}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl text-foreground">{bias.name}</CardTitle>
                  <Badge variant={bias.color as any}>
                    {bias.severity}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{bias.description}</p>
                <div className="flex gap-3">
                  <Button 
                    onClick={() => navigate(`/correction/${bias.name.toLowerCase()}`)}
                    variant="science"
                    className="flex-1"
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    웹툰으로 교정하기
                  </Button>
                  <Button 
                    onClick={() => navigate(`/correction/${bias.name.toLowerCase()}?type=animation`)}
                    variant="science"
                    className="flex-1"
                  >
                    <Play className="mr-2 h-4 w-4" />
                    애니메이션으로 교정하기
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Button onClick={() => navigate('/bias-test')} variant="outline">
            다시 검사하기
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TestResults;