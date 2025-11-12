import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Loader2, Film } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { biasList } from "@/lib/bias";

const TestResults = () => {
  const [results, setResults] = useState<any>([]);
  const [id, setId] = useState<any>("");
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
        "1": "Anchoring Bias",
        "2": "Availability Heuristic",
        "3": "Halo Effect",
        "4": "Bandwagon Effect",
        "5": "Authority Bias",
        "6": "False Consensus Effect",
        "7": "Halo Effect",
        "8": "Social Comparison Bias",
        "9": "In-group Bias",
        "10": "Shared Information Bias",
        "11": "Zero-Sum Bias",
        "12": "Halo Effect",
        "13": "Self-Serving Bias",
        "14": "Just-World Hypothesis",
        "15": "Sunk Cost Fallacy",
        "16": "Egocentric Bias",
        "17": "Optimism Bias",
        "18": "Status Quo Bias",
        "19": "Confirmation Bias",
        "20": "Belief Perseverance",
        "21": "Dunning-Kruger Effect",
        "22": "Loss Aversion",
        "23": "IKEA Effect",
        "24": "Curse of Knowledge",
        "25": "Illusion of Control",
        "26": "Illusion of Control",
        "27": "Illusion of Control",
        "28": "Messenger Effect",
        "29": "Defensiveness Bias",
        "30": "Fundamental Attribution Error",
      };

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
          if (scores.length > 1) {
            const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
            return avg > 3; // ✅ reversed condition
          }

          return scores[0] > 3;
        })
        .map(([bias]) => biasList.find((b) => b.biasName === bias))
        .filter(Boolean);

      setId(data.id);
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
        <h2 className="text-2xl font-bold mb-4">
          특별한 인지편향이 발견되지 않았습니다 🎉
        </h2>
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
        <p className="text-muted-foreground mb-8">
          다음과 같은 인지편향이 감지되었습니다:
        </p>

        {results.map((bias, i) => (
          <Card key={i} className="shadow-card mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{bias.biasNameKor}</CardTitle>
                <Badge
                  variant={bias.severity === "high" ? "destructive" : "default"}
                >
                  {bias.severity}
                </Badge>
              </div>
            </CardHeader>

            <CardContent>
              <p className="mb-4 text-muted-foreground">{bias.description}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button
                  onClick={() =>
                    navigate(
                      `/correction/${bias.biasName
                        .replaceAll(" ", "-")
                        .toLowerCase()}/animation/${id}`
                    )
                  }
                  className="w-full bg-modern-dark hover:bg-modern-green text-white font-medium"
                >
                  <Film className="mr-2 h-4 w-4" />
                  Correct with Webtoon / Animation
                </Button>

                <Button
                  onClick={() =>
                    navigate(
                      `/correction/${bias.biasName
                        .replaceAll(" ", "-")
                        .toLowerCase()}/video/${id}`
                    )
                  }
                  className="w-full bg-modern-dark hover:bg-modern-green text-white font-medium"
                >
                  <Film className="mr-2 h-4 w-4" />
                  Correct with Video
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TestResults;
