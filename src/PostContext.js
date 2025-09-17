import { createContext, useContext, useMemo, useState } from "react";
import { faker } from "@faker-js/faker";

function createRandomPost() {
  return {
    title: `${faker.hacker.adjective()} ${faker.hacker.noun()}`,
    body: faker.hacker.phrase(),
  };
}

//1) CREATE CONTEXT
const PostContext = createContext();

function PostProvider({ children }) {
  const [posts, setPosts] = useState(() =>
    Array.from({ length: 30 }, () => createRandomPost())
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Derived state. These are the posts that will actually be displayed
  const searchedPosts =
    searchQuery.length > 0
      ? posts.filter((post) =>
          `${post.title} ${post.body}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        )
      : posts;

  function handleAddPost(post) {
    setPosts((posts) => [post, ...posts]);
  }

  function handleClearPosts() {
    setPosts([]);
  }

  //انا عملت كدا عشان دا ابن للاب فكل مره الاب بيحصل ريندر فدا بيتعمل ليه ريندر تاني عشان هو ابن ليه وكمان الاوبجكت والفانكشن اللي جواه بتتكون تاني فاانا كدا بحافظ علي اسباب الريندر للكموبنت
  const value = useMemo(() => {
    return {
      posts: searchedPosts,
      onAddPost: handleAddPost,
      onClearPosts: handleClearPosts,
      searchQuery,
      setSearchQuery,
    };
  }, [searchQuery, searchedPosts]);
  return (
    //2) PASS VALUES CONTEXT
    <PostContext.Provider value={value}>{children}</PostContext.Provider>
  );
}

// useContext(PostContext) دي بديله ل كل شويه اكتب كدا في الاب
//custom hook عشان تقرأ الداتا او القيم اللي راجعه من الكونتكست
function usePosts() {
  const context = useContext(PostContext);
  if (context === undefined)
    throw new Error("PostContext Was used outside the PostProvider");
  return context;
}

export { PostProvider, usePosts };
