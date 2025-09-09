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
    name: "가용성편향",
    description: "최근에 경험했거나 기억하기 쉬운 사건의 가능성을 과대평가하는 경향",
    severity: "보통",
    color: "default"
  },
  anchoring: {
    name: "앵커링편향",
    description: "처음 접한 정보에 과도하게 의존하여 후속 판단을 내리는 경향",
    severity: "보통",
    color: "secondary"
  },
  authority: {
    name: "권위편향",
    description: "권위자나 전문가의 의견을 비판 없이 수용하는 경향",
    severity: "보통",
    color: "secondary"
  },
  conformity: {
    name: "동조편향",
    description: "집단의 의견에 맞추려 하고 다수의 선택을 따르는 경향",
    severity: "보통",
    color: "default"
  },
  overconfidence: {
    name: "과신편향",
    description: "자신의 판단이나 능력을 실제보다 과대평가하는 경향",
    severity: "높음",
    color: "destructive"
  },
  halo: {
    name: "후광효과",
    description: "한 가지 긍정적 특성을 바탕으로 전체를 긍정적으로 평가하는 경향",
    severity: "보통",
    color: "secondary"
  },
  inferiority: {
    name: "열등감편향",
    description: "다른 사람과 비교하여 자신을 과소평가하는 경향",
    severity: "보통",
    color: "default"
  },
  ingroup: {
    name: "내집단편향",
    description: "자신이 속한 집단을 다른 집단보다 선호하고 편향적으로 평가하는 경향",
    severity: "높음",
    color: "destructive"
  },
  loss_aversion: {
    name: "손실회피편향",
    description: "이익을 얻는 것보다 손실을 피하는 것을 더 중요하게 여기는 경향",
    severity: "보통",
    color: "secondary"
  },
  attribution: {
    name: "귀인편향",
    description: "성공은 내부 요인으로, 실패는 외부 요인으로 돌리는 자기중심적 해석 경향",
    severity: "높음",
    color: "destructive"
  },
  entitlement: {
    name: "권리의식편향",
    description: "자신이 받을 권리가 있다고 생각하는 것을 과대평가하는 경향",
    severity: "보통",
    color: "default"
  },
  sunk_cost: {
    name: "매몰비용편향",
    description: "이미 투자한 비용 때문에 비합리적인 선택을 지속하는 경향",
    severity: "높음",
    color: "destructive"
  },
  victim: {
    name: "피해의식편향",
    description: "자신이 다른 사람보다 더 어려운 상황에 있다고 생각하는 경향",
    severity: "보통",
    color: "default"
  },
  optimism: {
    name: "낙관편향",
    description: "미래의 결과를 실제보다 긍정적으로 예상하는 경향",
    severity: "보통",
    color: "secondary"
  },
  status_quo: {
    name: "현상유지편향",
    description: "변화를 피하고 현재 상황을 유지하려는 경향",
    severity: "보통",
    color: "default"
  },
  endowment: {
    name: "소유효과편향",
    description: "자신이 소유한 것에 과도하게 높은 가치를 부여하는 경향",
    severity: "보통",
    color: "secondary"
  },
  transparency: {
    name: "투명성착각편향",
    description: "자신의 생각이나 지식이 다른 사람에게도 명확할 것이라고 가정하는 경향",
    severity: "보통",
    color: "default"
  },
  impact_illusion: {
    name: "영향력착각편향",
    description: "자신의 행동이나 발언이 다른 사람에게 미치는 영향을 과대평가하는 경향",
    severity: "보통",
    color: "secondary"
  },
  defensive: {
    name: "방어적편향",
    description: "비판이나 반대 의견에 대해 즉각적으로 방어적 자세를 취하는 경향",
    severity: "보통",
    color: "default"
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
      const questionToBias: Record<string, string> = {
        "1": "anchoring", "2": "availability", "3": "authority", "4": "conformity", "5": "authority",
        "6": "overconfidence", "7": "halo", "8": "inferiority", "9": "ingroup", "10": "availability",
        "11": "loss_aversion", "12": "halo", "13": "attribution", "14": "entitlement", "15": "sunk_cost",
        "16": "victim", "17": "optimism", "18": "status_quo", "19": "confirmation", "20": "confirmation",
        "21": "overconfidence", "22": "loss_aversion", "23": "endowment", "24": "transparency", "25": "impact_illusion",
        "26": "impact_illusion", "27": "impact_illusion", "28": "impact_illusion", "29": "defensive", "30": "defensive"
      };
      
      const bias = questionToBias[questionId];
      if (bias) {
        biasScores[bias] = (biasScores[bias] || 0) + (score as number);
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
            <h2 className="text-2xl font-black mb-4 text-foreground">축하합니다!</h2>
            <p className="text-muted-foreground mb-6 font-light">
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
          <h1 className="text-3xl font-black text-foreground mb-2 animate-fade-in">
            진단 결과
          </h1>
          <p className="text-muted-foreground animate-fade-in font-light">
            다음과 같은 인지편향이 발견되었습니다
          </p>
        </div>

        <div className="space-y-6">
          {results.map((bias, index) => (
            <Card key={bias.name} className="shadow-card animate-scale-in" style={{animationDelay: `${index * 0.1}s`}}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl text-foreground font-bold">{bias.name}</CardTitle>
                  <Badge variant={bias.color as any}>
                    {bias.severity}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 font-light">{bias.description}</p>
                <div className="flex gap-3">
                  <Button 
                    onClick={() => navigate(`/correction/${bias.name.toLowerCase()}`)}
                    className="flex-1 bg-modern-dark hover:bg-modern-green text-white font-medium"
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    웹툰으로 교정하기
                  </Button>
                  <Button 
                    onClick={() => navigate(`/correction/${bias.name.toLowerCase()}?type=animation`)}
                    variant="outline"
                    className="flex-1 border-2 border-modern-green text-modern-dark hover:bg-modern-green hover:text-white font-medium"
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