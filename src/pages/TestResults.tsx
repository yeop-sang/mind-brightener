import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Loader2, Film } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

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
    color: "destructive",
  },
  availability: {
    name: "가용성편향",
    description: "최근에 경험했거나 기억하기 쉬운 사건의 가능성을 과대평가하는 경향",
    severity: "보통",
    color: "default",
  },
  anchoring: {
    name: "앵커링편향",
    description: "처음 접한 정보에 과도하게 의존하여 후속 판단을 내리는 경향",
    severity: "보통",
    color: "secondary",
  },
  authority: {
    name: "권위편향",
    description: "권위자나 전문가의 의견을 비판 없이 수용하는 경향",
    severity: "보통",
    color: "secondary",
  },
  conformity: {
    name: "동조편향",
    description: "집단의 의견에 맞추려 하고 다수의 선택을 따르는 경향",
    severity: "보통",
    color: "default",
  },
  overconfidence: {
    name: "과신편향",
    description: "자신의 판단이나 능력을 실제보다 과대평가하는 경향",
    severity: "높음",
    color: "destructive",
  },
  halo: {
    name: "후광효과",
    description: "한 가지 긍정적 특성을 바탕으로 전체를 긍정적으로 평가하는 경향",
    severity: "보통",
    color: "secondary",
  },
  inferiority: {
    name: "열등감편향",
    description: "다른 사람과 비교하여 자신을 과소평가하는 경향",
    severity: "보통",
    color: "default",
  },
  ingroup: {
    name: "내집단편향",
    description: "자신이 속한 집단을 다른 집단보다 선호하고 편향적으로 평가하는 경향",
    severity: "높음",
    color: "destructive",
  },
  loss_aversion: {
    name: "손실회피편향",
    description: "이익을 얻는 것보다 손실을 피하는 것을 더 중요하게 여기는 경향",
    severity: "보통",
    color: "secondary",
  },
  attribution: {
    name: "귀인편향",
    description: "성공은 내부 요인으로, 실패는 외부 요인으로 돌리는 자기중심적 해석 경향",
    severity: "높음",
    color: "destructive",
  },
  entitlement: {
    name: "권리의식편향",
    description: "자신이 받을 권리가 있다고 생각하는 것을 과대평가하는 경향",
    severity: "보통",
    color: "default",
  },
  sunk_cost: {
    name: "매몰비용편향",
    description: "이미 투자한 비용 때문에 비합리적인 선택을 지속하는 경향",
    severity: "높음",
    color: "destructive",
  },
  victim: {
    name: "피해의식편향",
    description: "자신이 다른 사람보다 더 어려운 상황에 있다고 생각하는 경향",
    severity: "보통",
    color: "default",
  },
  optimism: {
    name: "낙관편향",
    description: "미래의 결과를 실제보다 긍정적으로 예상하는 경향",
    severity: "보통",
    color: "secondary",
  },
  status_quo: {
    name: "현상유지편향",
    description: "변화를 피하고 현재 상황을 유지하려는 경향",
    severity: "보통",
    color: "default",
  },
  endowment: {
    name: "소유효과편향",
    description: "자신이 소유한 것에 과도하게 높은 가치를 부여하는 경향",
    severity: "보통",
    color: "secondary",
  },
  transparency: {
    name: "투명성착각편향",
    description: "자신의 생각이나 지식이 다른 사람에게도 명확할 것이라고 가정하는 경향",
    severity: "보통",
    color: "default",
  },
  impact_illusion: {
    name: "영향력착각편향",
    description: "자신의 행동이나 발언이 다른 사람에게 미치는 영향을 과대평가하는 경향",
    severity: "보통",
    color: "secondary",
  },
  defensive: {
    name: "방어적편향",
    description: "비판이나 반대 의견에 대해 즉각적으로 방어적 자세를 취하는 경향",
    severity: "보통",
    color: "default",
  },
};

const TestResults = () => {
  const [results, setResults] = useState<BiasResult[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const userId = localStorage.getItem("user_id");
      if (!userId) {
        toast({
          title: "로그인 필요",
          description: "결과를 보려면 로그인이 필요합니다.",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      const { data, error } = await supabase
        .from("bias_test_results")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (error || !data) {
        toast({
          title: "결과 없음",
          description: "먼저 테스트를 완료해주세요.",
        });
        navigate("/bias-test");
        return;
      }

      const answers = data.answers as Record<string, number>;
      const questionToBias: Record<string, string> = {
        "1": "anchoring",
        "2": "availability",
        "3": "authority",
        "4": "conformity",
        "5": "authority",
        "6": "overconfidence",
        "7": "halo",
        "8": "inferiority",
        "9": "ingroup",
        "10": "availability",
        "11": "loss_aversion",
        "12": "halo",
        "13": "attribution",
        "14": "entitlement",
        "15": "sunk_cost",
        "16": "victim",
        "17": "optimism",
        "18": "status_quo",
        "19": "confirmation",
        "20": "confirmation",
        "21": "overconfidence",
        "22": "loss_aversion",
        "23": "endowment",
        "24": "transparency",
        "25": "impact_illusion",
        "26": "impact_illusion",
        "27": "impact_illusion",
        "28": "impact_illusion",
        "29": "defensive",
        "30": "defensive",
      };

      // Hitung bias berdasarkan rule baru
      const biasScores: Record<string, number[]> = {};
      Object.entries(answers).forEach(([qId, score]) => {
        const bias = questionToBias[qId];
        if (bias) {
          biasScores[bias] = biasScores[bias] || [];
          biasScores[bias].push(score);
        }
      });

      const detectedBiases = Object.entries(biasScores)
        .filter(([bias, scores]) => {
          const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
          return avg <= 3; // average score ≤ 3 indicates bias detected
        })
        .map(([bias]) => biasDefinitions[bias])
        .filter(Boolean);

      setResults(detectedBiases);
    } catch (err: any) {
      console.error(err);
      toast({
        title: "오류 발생",
        description: "결과를 불러오는 중 문제가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader2 className="w-8 h-8 animate-spin text-modern-dark" />
      </div>
    );

  if (results.length === 0)
    return (
      <div className="min-h-screen flex flex-col justify-center items-center">
        <h2 className="text-2xl font-bold mb-4">특별한 인지편향이 발견되지 않았습니다 🎉</h2>
        <Button onClick={() => navigate("/")} variant="outline">
          메인으로 돌아가기
        </Button>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-calm-green py-8">
      <div className="container mx-auto max-w-4xl px-4">
        <Button variant="ghost" onClick={() => navigate("/")}>
          <ChevronLeft className="mr-2 h-4 w-4" /> 메인으로
        </Button>
        <h1 className="text-3xl font-black my-4">진단 결과</h1>
        <p className="text-muted-foreground mb-8">다음과 같은 인지편향이 감지되었습니다:</p>

        {results.map((bias, i) => (
          <Card key={i} className="shadow-card mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{bias.name}</CardTitle>
                <Badge variant={bias.color as any}>{bias.severity}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-muted-foreground">{bias.description}</p>
              <Button
                onClick={() => navigate(`/correction/${bias.name.toLowerCase()}`)}
                className="w-full bg-modern-dark hover:bg-modern-green text-white font-medium"
              >
                <Film className="mr-2 h-4 w-4" />
                미디어로 교정하기
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TestResults;
