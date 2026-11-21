import API from "./api";

export const groupService = {
  async list() {
    const { data } = await API.get("/groups");
    return data.data.groups;
  },
  async get(id) {
    const { data } = await API.get(`/groups/${id}`);
    return data.data.group;
  },
  async create(payload) {
    const { data } = await API.post("/groups", payload);
    return data.data.group;
  },
  async update(id, payload) {
    const { data } = await API.patch(`/groups/${id}`, payload);
    return data.data.group;
  },
  async remove(id) {
    const { data } = await API.delete(`/groups/${id}`);
    return data;
  },
  async members(id) {
    const { data } = await API.get(`/groups/${id}/members`);
    return data.data.members;
  },
  async addMembers(id, members) {
    const { data } = await API.post(`/groups/${id}/members`, { members });
    return data.data;
  },
  async updateMemberRole(id, userId, role) {
    const { data } = await API.patch(`/groups/${id}/members/${userId}/role`, { role });
    return data.data.members;
  },
  async removeMember(id, userId) {
    const { data } = await API.delete(`/groups/${id}/members/${userId}`);
    return data.data.members;
  },
  async leave(id) {
    const { data } = await API.post(`/groups/${id}/leave`);
    return data;
  },
  async joinByCode(code) {
    const { data } = await API.post("/groups/join", { code });
    return data.data.group;
  },
  async balances(id) {
    const { data } = await API.get(`/groups/${id}/balances`);
    return data.data;
  },
  async settlementPlan(id) {
    const { data } = await API.get(`/groups/${id}/balances/plan`);
    return data.data.plan;
  },
  async settle(id, payload) {
    const { data } = await API.post(`/groups/${id}/settle`, payload);
    return data.data.settlement;
  },
  async expenses(id, params = {}) {
    const { data } = await API.get(`/groups/${id}/expenses`, { params });
    return data.data;
  },
  async activity(id) {
    const { data } = await API.get(`/groups/${id}/activity`);
    return data.data;
  },
};

export const expenseService = {
  async listAll(params = {}) {
    const { data } = await API.get("/expenses", { params });
    return data.data.expenses;
  },
  async get(id) {
    const { data } = await API.get(`/expenses/${id}`);
    return data.data.expense;
  },
  async create(groupId, payload) {
    const { data } = await API.post(`/groups/${groupId}/expenses`, payload);
    return data.data.expense;
  },
  async update(id, payload) {
    const { data } = await API.patch(`/expenses/${id}`, payload);
    return data.data.expense;
  },
  async remove(id) {
    const { data } = await API.delete(`/expenses/${id}`);
    return data;
  },
};

export const dashboardService = {
  async overview() {
    const { data } = await API.get("/dashboard/overview");
    return data.data;
  },
  async tabs() {
    const { data } = await API.get("/dashboard/tabs");
    return data.data.tabs;
  },
  async graphPlan() {
    const { data } = await API.get("/dashboard/graph-plan");
    return data.data;
  },
  async liveFeed() {
    const { data } = await API.get("/dashboard/live-feed");
    return data.data.feed;
  },
};

export const balanceService = {
  async overview() {
    const { data } = await API.get("/balances/overview");
    return data.data;
  },
};

export const notificationService = {
  async list() {
    const { data } = await API.get("/notifications");
    return data.data;
  },
  async markAllRead() {
    const { data } = await API.patch("/notifications/read-all");
    return data;
  },
};

export const activityService = {
  async list() {
    const { data } = await API.get("/activity");
    return data.data.items;
  },
};

export const userService = {
  async peers() {
    const { data } = await API.get("/users/peers");
    return data.data.peers;
  },
  async search(q) {
    const { data } = await API.get("/users/search", { params: { q } });
    return data.data.users;
  },
  async completeOnboarding(payload) {
    const { data } = await API.post("/users/me/onboarding", payload);
    return data.data.user;
  },
};