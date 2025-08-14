import axios from "axios";

export const guestPolicyAPI = {
  search: (payload) => axios.post("/api/guestPolicy/search", payload),
  getPopularKeywords: () => axios.get("/api/guestPolicy/popular-keywords"),
  getTopByViewsAll: (count = 1000) =>
    axios.get("/api/guestPolicy/search/top-views/all", { params: { count } }),
};
