import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, BookOpen, Play, Heart, Send } from "lucide-react";
import { biasList } from "@/lib/bias";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Define types for the feedback data
interface BiasFeedback {
  id?: string;
  user_id: string;
  bias_name: string;
  test_id: string;
  is_liked: boolean;
  reflection?: string;
  created_at?: string;
  updated_at?: string;
}

interface TestCompletion {
  id?: string;
  user_id: string;
  test_id: string;
  bias_name: string;
  completed: boolean;
  completed_at?: string;
  created_at?: string;
  updated_at?: string;
}

const BiasCorrection = () => {
  const { biasName, type, idtest } = useParams();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [reflection, setReflection] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [hasCompleted, setHasCompleted] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        await fetchFeedbackStatus(user.id);
        await checkCompletionStatus(user.id);
      }
    };

    fetchUser();
  }, [biasName, idtest]);

  const fetchFeedbackStatus = async (userId: string) => {
    if (!idtest || !biasName) return;

    try {
      const { data, error } = await supabase
        .from("bias_feedback")
        .select("is_liked, reflection")
        .eq("user_id", userId)
        .eq("bias_name", biasName)
        .eq("test_id", idtest)
        .maybeSingle();

      if (data && !error) {
        setIsLiked(data.is_liked);
        setReflection(data.reflection || "");
      }

      // Fetch total like count for this bias and test
      const { count, error: countError } = await supabase
        .from("bias_feedback")
        .select("*", { count: "exact", head: true })
        .eq("bias_name", biasName)
        .eq("test_id", idtest)
        .eq("is_liked", true);

      if (!countError && count !== null) {
        setLikeCount(count);
      }
    } catch (error) {
      console.error("Error fetching feedback:", error);
    }
  };

  const checkCompletionStatus = async (userId: string) => {
    if (!idtest || !biasName) return;

    try {
      const { data, error } = await supabase
        .from("test_completion")
        .select("completed")
        .eq("user_id", userId)
        .eq("test_id", idtest)
        .eq("bias_name", biasName)
        .maybeSingle();

      if (data && !error) {
        setHasCompleted(data.completed);
      }
    } catch (error) {
      console.error("Error checking completion:", error);
    }
  };

  const handleLike = async () => {
    if (!userId || !idtest || !biasName) {
      toast.error("로그인이 필요합니다");
      return;
    }

    try {
      const newLikeStatus = !isLiked;

      // Use type assertion for the upsert operation
      const { error } = await supabase.from("bias_feedback").upsert(
        {
          user_id: userId,
          bias_name: biasName,
          test_id: idtest,
          is_liked: newLikeStatus,
          updated_at: new Date().toISOString(),
        } as any,
        {
          onConflict: "user_id,bias_name,test_id",
        }
      );

      if (error) {
        console.error("Error updating like:", error);
        toast.error("피드백 저장 중 오류가 발생했습니다");
        return;
      }

      setIsLiked(newLikeStatus);
      setLikeCount((prev) => (newLikeStatus ? prev + 1 : prev - 1));

      toast.success(newLikeStatus ? "공감했습니다!" : "공감을 취소했습니다");
    } catch (error) {
      console.error("Like error:", error);
      toast.error("처리 중 오류가 발생했습니다");
    }
  };

  const handleReflectionSubmit = async () => {
    if (!userId || !idtest || !biasName) {
      toast.error("로그인이 필요합니다");
      return;
    }

    if (!reflection.trim()) {
      toast.error("경험을 입력해주세요");
      return;
    }

    try {
      // Save reflection
      const { error: feedbackError } = await supabase
        .from("bias_feedback")
        .upsert(
          {
            user_id: userId,
            bias_name: biasName,
            test_id: idtest,
            reflection: reflection,
            updated_at: new Date().toISOString(),
          } as any,
          {
            onConflict: "user_id,bias_name,test_id",
          }
        );

      if (feedbackError) {
        console.error("Error saving reflection:", feedbackError);
        toast.error("리플렉션 저장 중 오류가 발생했습니다");
        return;
      }

      // Mark as completed
      const { error: completionError } = await supabase
        .from("test_completion")
        .upsert(
          {
            user_id: userId,
            test_id: idtest,
            bias_name: biasName,
            completed: true,
            completed_at: new Date().toISOString(),
          } as any,
          {
            onConflict: "user_id,test_id,bias_name",
          }
        );

      if (completionError) {
        console.error("Error marking completion:", completionError);
        toast.error("완료 상태 저장 중 오류가 발생했습니다");
        return;
      }

      setHasCompleted(true);
      toast.success("경험이 저장되었습니다!");
    } catch (error) {
      console.error("Reflection error:", error);
      toast.error("처리 중 오류가 발생했습니다");
    }
  };

  const bias = biasList.find(
    (b: any) =>
      b.biasName.replaceAll(" ", "-").toLowerCase() ===
      (biasName || "").toLowerCase()
  );

  if (!bias) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-calm-green flex items-center justify-center">
        <Card className="shadow-card animate-scale-in max-w-md w-full mx-4">
          <CardContent className="text-center py-8">
            <h2 className="text-xl font-black mb-4 text-foreground">
              콘텐츠를 찾을 수 없습니다
            </h2>
            <Button onClick={() => navigate("/results")} variant="hero">
              결과로 돌아가기
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const contentList = type === "animation" ? bias.animationUrl : bias.videoUrl;
  const hasMultiple = contentList.length > 1;

  // Check if the current content is a video
  const isVideoContent = (url: string) => {
    return url.match(/\.(mp4|webm|ogg|mov|avi)$/i) !== null;
  };

  const currentContent = contentList[currentIndex];
  const isCurrentVideo = isVideoContent(currentContent);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-calm-green py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/results")}
          className="mb-4"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          결과로 돌아가기
        </Button>

        {/* Title with Like Button */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-black text-foreground animate-fade-in">
              {bias.biasNameKor}
            </h1>
            {idtest && (
              <p className="text-sm text-muted-foreground mt-1">
                Test ID: {idtest}
              </p>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            className={`flex items-center gap-2 ${
              isLiked ? "text-red-500" : "text-muted-foreground"
            }`}
          >
            <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
            <span>{likeCount}</span>
          </Button>
        </div>

        {/* Tab Buttons if multiple contents */}
        {hasMultiple && (
          <div className="flex justify-center gap-2 mb-4">
            {contentList.map((_, index) => (
              <Button
                key={index}
                variant={index === currentIndex ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentIndex(index)}
              >
                콘텐츠 {index + 1}
              </Button>
            ))}
          </div>
        )}

        {/* Content Card */}
        <Card className="shadow-card animate-scale-in mb-6">
          <CardContent className="p-6">
            {type === "animation" && isCurrentVideo ? (
              // Video content in animation mode
              <div>
                <div className="w-full mb-4 flex justify-center">
                  <video
                    controls
                    className="max-w-full rounded-lg bg-black"
                    style={{ maxHeight: "60vh" }}
                  >
                    <source src={currentContent} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
                <p className="text-muted-foreground font-light text-center">
                  {bias.description}
                </p>
              </div>
            ) : type === "animation" ? (
              // Image content in animation mode
              <div className="flex flex-col items-center">
                <img
                  src={currentContent}
                  alt={`${bias.biasNameKor} 웹툰 ${currentIndex + 1}`}
                  className="max-w-full h-auto rounded-lg mb-6"
                  style={{ maxHeight: "70vh" }}
                />
                <p className="text-muted-foreground font-light text-center">
                  {bias.description}
                </p>
              </div>
            ) : isCurrentVideo ? (
              // Video content in video mode
              <div>
                <div className="w-full mb-4 flex justify-center">
                  <video
                    controls
                    className="max-w-full rounded-lg bg-black"
                    style={{ maxHeight: "60vh" }}
                  >
                    <source src={currentContent} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
                <p className="text-muted-foreground font-light text-center">
                  {bias.description}
                </p>
              </div>
            ) : (
              // Image content in video mode (fallback)
              <div className="flex flex-col items-center">
                <img
                  src={currentContent}
                  alt={`${bias.biasNameKor} 콘텐츠 ${currentIndex + 1}`}
                  className="max-w-full h-auto rounded-lg mb-6"
                  style={{ maxHeight: "70vh" }}
                />
                <p className="text-muted-foreground font-light text-center">
                  {bias.description}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Reflection Section */}
        {!hasCompleted && (
          <Card className="shadow-card animate-scale-in mb-6">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-foreground">
                📝 나의 경험 공유하기
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                이 편향과 관련된 자신의 실험실이나 일상 생활에서의 경험을
                공유해주세요.
              </p>
              <Textarea
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                placeholder="예: 우리 연구실에서 이 편향이 어떻게 나타났는지, 어떤 문제를 일으켰는지, 어떻게 해결했는지 등 구체적인 경험을 적어주세요..."
                className="min-h-[120px] mb-4 resize-none"
              />
              <Button
                onClick={handleReflectionSubmit}
                className="w-full bg-modern-dark hover:bg-modern-green"
                disabled={!reflection.trim()}
              >
                <Send className="mr-2 h-4 w-4" />
                경험 저장하기
              </Button>
            </CardContent>
          </Card>
        )}

        {hasCompleted && (
          <Card className="shadow-card animate-scale-in mb-6 border-green-200 bg-green-50">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-green-800">
                  경험이 저장되었습니다!
                </h3>
                <p className="text-sm text-green-600">
                  소중한 경험을 공유해주셔서 감사합니다.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Switch Mode Button */}
        <div className="flex gap-4">
          {type === "animation" ? (
            <Button
              onClick={() =>
                navigate(`/correction/${biasName}/video/${idtest}`)
              }
              variant="outline"
              className="flex-1"
            >
              <Play className="mr-2 h-4 w-4" />
              비디오로 보기
            </Button>
          ) : (
            <Button
              onClick={() =>
                navigate(`/correction/${biasName}/animation/${idtest}`)
              }
              variant="outline"
              className="flex-1"
            >
              <BookOpen className="mr-2 h-4 w-4" />
              웹툰으로 보기
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BiasCorrection;
