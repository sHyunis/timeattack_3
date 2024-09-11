import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "./api/api";
import { useState } from "react";

const App = () => {
  const [title, setTitle] = useState("");
  const [views, setViews] = useState("");
  const queryClient = useQueryClient();

  // 포스트 불러오기
  const {
    data: posts,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const response = await api.get("/posts");
      return response.data;
    },
  });

  // 제목 조회수 추가
  const mutation = useMutation({
    mutationFn: async (post) => {
      const response = await api.post("/posts", post);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({ title, views });

    // 로딩, 에러처리
    if (isLoading) {
      return <p>로딩중입니다...</p>;
    }
    if (error) {
      return <p>오류가 발생하였습니다...</p>;
    }
  };
  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          placeholder="Title"
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="VIEWS"
          value={views}
          onChange={(e) => setViews(e.target.value)}
        />
        <button type="submit">추가</button>
      </form>
      {posts?.map((post) => {
        return (
          <div key={post.id}>
            <p>{post.title}</p>
            <p>{post.views}</p>
          </div>
        );
      })}
    </>
  );
};

export default App;
