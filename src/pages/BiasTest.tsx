import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Question {
  id: number;
  text: string;
  bias: string;
}

const questions: Question[] = [
  { id: 1, text: "회의할 때 처음 제시된 의견이 최종 결정에 상당히 영향을 미친다.", bias: "anchoring" },
  { id: 2, text: "언론과 주변 동료로부터 자주 듣게 되는 연구 주제가 중요한 연구이다.", bias: "availability" },
  { id: 3, text: "회의할 때 일관된 의견을 제시하는 사람의 의견이 타당한 것 같다.", bias: "authority" },
  { id: 4, text: "자기 생각과 다르더라도 동료들과 유사한 선택을 할 때 편안함을 느낀다.", bias: "conformity" },
  { id: 5, text: "자기보다 전문가인 사람(교수/전공자)의 의견은 일단 믿고 따른다.", bias: "authority" },
  { id: 6, text: "내가 내는 의견에 찬성하는 사람이 많을 것이라고 생각한다.", bias: "overconfidence" },
  { id: 7, text: "내가 호의적으로 생각하는 사람의 말에 더 신뢰가 간다.", bias: "halo" },
  { id: 8, text: "나는 능력이 뛰어난 사람들과 함께 있을 때 불편함을 느낀다.", bias: "inferiority" },
  { id: 9, text: "나는 다른 팀의 사람들보다 우리 팀 구성원의 의견을 더 중요하게 생각한다.", bias: "ingroup" },
  { id: 10, text: "회의할 때 일부만 알고 있는 정보보다 모든 사람에게 익숙한 정보를 더 많이 논의한다.", bias: "availability" },
  { id: 11, text: "공동 연구를 할 때 자신의 노하우를 공유하면 손해보는 것 같아서 공유하기가 꺼려진다.", bias: "loss_aversion" },
  { id: 12, text: "어떤 사람이 특정 일을 잘하면, 그다음 일도 잘할 것으로 생각한다.", bias: "halo" },
  { id: 13, text: "결과가 좋으면 내 기여 덕분이고, 결과가 나쁘면 다른 사람 탓이라고 생각한다.", bias: "attribution" },
  { id: 14, text: "내가 노력한 만큼 보상을 받는 것이 당연하다고 생각한다.", bias: "entitlement" },
  { id: 15, text: "내 연구 방향이 잘못되었음을 깨달아도, 지금까지 해온 것을 포기하고 새로 시작하기가 어렵다.", bias: "sunk_cost" },
  { id: 16, text: "다른 사람에 비해 내가 맡은 일이 더 힘들고 어려운 일인 것 같다.", bias: "victim" },
  { id: 17, text: "내가 하는 일은 왠지 잘될 것 같다.", bias: "optimism" },
  { id: 18, text: "특별한 이득이 없다면 새로운 시도보다 현재 상태를 유지한다.", bias: "status_quo" },
  { id: 19, text: "내 생각과 일치하는 사례는 쉽게 눈에 들어오지만, 일치하지 않는 사례는 잘 보이지 않는다.", bias: "confirmation" },
  { id: 20, text: "새로운 증거가 제시되었더라도 기존의 신념을 쉽게 수정하기 어렵다.", bias: "confirmation" },
  { id: 21, text: "사람들은 다른 사람들보다 자신의 연구 능력이 뛰어난 편이라고 생각한다.", bias: "overconfidence" },
  { id: 22, text: "위험을 감수하고 도전하는 것보다 손실을 최소화하는 것을 선호한다.", bias: "loss_aversion" },
  { id: 23, text: "시간과 노력을 들여 직접 얻은 성과에 대해 특히 더 높은 가치를 부여한다.", bias: "endowment" },
  { id: 24, text: "내가 알고 있는 것은 다른 사람도 잘 알 것이라 생각하고 자세히 설명하지 않는다.", bias: "transparency" },
  { id: 25, text: "회의할 때 내가 발언을 시작하면 전체 논의 분위기가 긍정적으로 달라진다.", bias: "impact_illusion" },
  { id: 26, text: "동료와 협업할 때, 내가 제시한 아이디어가 논의의 진행 속도나 방향에 큰 영향을 미친다.", bias: "impact_illusion" },
  { id: 27, text: "내가 먼저 피드백을 제시하면 팀의 논의 흐름에 긍정적인 변화가 생긴다.", bias: "impact_illusion" },
  { id: 28, text: "내가 질문을 던질 때, 팀원들이 논의에 더 적극적으로 참여한다고 느낀다.", bias: "impact_illusion" },
  { id: 29, text: "회의 중 누군가가 내 의견에 이의를 제기하면, 나는 즉각적으로 그 의견을 방어하려는 경향이 있다.", bias: "defensive" },
  { id: 30, text: "팀원이 실수를 했을 때, 나는 그 실수를 학습의 기회로 삼기보다는 책임을 묻는 경우가 많다.", bias: "defensive" }
];

const BiasTest = () => {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAnswerChange = (questionId: number, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const userId = localStorage.getItem("user_id");

      if (!userId) {
        toast({
          title: "로그인 필요",
          description: "테스트 결과를 저장하려면 로그인이 필요합니다.",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      // Simpan ke database Supabase
      const { data, error } = await supabase
        .from("bias_test_results")
        .insert([
          {
            user_id: userId,
            answers,
            created_at: new Date().toISOString(), // timestamp manual
          },
        ])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "저장 완료!",
        description: "테스트 결과가 저장되었습니다.",
      });

      // Simpan ID tes terakhir di localStorage
      if (data) {
        localStorage.setItem("latestTestId", data.id);
      }

      navigate("/results");
    } catch (err: any) {
      console.error("Error saving test results:", err);
      toast({
        title: "저장 실패",
        description: err.message || "결과 저장 중 문제가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const allAnswered = questions.every((q) => answers[q.id] !== undefined);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-calm-green py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <Button variant="ghost" onClick={() => navigate("/")} className="mb-4 font-medium">
            <ChevronLeft className="mr-2 h-4 w-4" />
            돌아가기
          </Button>
          <h1 className="text-3xl font-black text-foreground mb-2 animate-fade-in">
            인지편향 자가진단 검사
          </h1>
          <p className="text-muted-foreground animate-fade-in font-light">
            각 문항을 읽고 자신에게 해당하는 정도를 선택해주세요
          </p>
        </div>

        <Card className="shadow-card animate-scale-in">
          <CardHeader>
            <CardTitle className="text-xl text-center font-bold">
              진단 문항 ({Object.keys(answers).length}/30)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {questions.map((question, index) => (
              <div key={question.id} className="space-y-3 pb-6 border-b border-border last:border-b-0">
                <p className="font-bold text-foreground">
                  {index + 1}. {question.text}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground font-light">전혀 그렇지 않다</span>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        onClick={() => handleAnswerChange(question.id, value)}
                        className={`w-10 h-10 rounded-full border-2 transition-all duration-200 font-bold ${
                          answers[question.id] === value
                            ? "bg-modern-dark border-modern-dark text-white shadow-lg"
                            : "border-modern-beige hover:border-modern-green hover:bg-modern-green/10 text-modern-dark"
                        }`}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground font-light">매우 그렇다</span>
                </div>
              </div>
            ))}

            <div className="pt-6">
              <Button
                onClick={handleSubmit}
                disabled={!allAnswered || loading}
                variant="hero"
                size="lg"
                className="w-full font-bold"
              >
                {loading ? "저장 중..." : "결과 확인하기"}
                {!loading && <ChevronRight className="ml-2 h-4 w-4" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BiasTest;
