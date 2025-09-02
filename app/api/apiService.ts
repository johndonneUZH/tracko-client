/* eslint-disable */
import { ApplicationError } from "@/types/error";
import { ApiResponse } from "@/components/dashboard_Project/AIDialog";

export class ApiService {
  private baseURL: string = "/api";
  private defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
  };

  //Including token to get access
  private buildHeaders(): HeadersInit {
    const token = sessionStorage.getItem("token");
    return {
      ...this.defaultHeaders,
      ...(token ? { Authorization: token } : {}),
    };
  }

  private async processResponse<T>(res: Response, errorMessage: string): Promise<T> {
    if (!res.ok) {
      let errorDetail = res.statusText;
      try {
        const errorInfo = await res.json();
        if (errorInfo?.message) errorDetail = errorInfo.message;
        else errorDetail = JSON.stringify(errorInfo);
      } catch {/* ignore */}
      const detailedMessage = `${errorMessage} (${res.status}: ${errorDetail})`;
      const error: ApplicationError = new Error(detailedMessage) as ApplicationError;
      error.info = JSON.stringify({ status: res.status, statusText: res.statusText }, null, 2);
      error.status = res.status;
      throw error;
    }
    return res.headers.get("Content-Type")?.includes("application/json")
      ? (res.json() as Promise<T>)
      : (res as unknown as T);
  }

  // ---------- GETs ----------
  public async get<T>(endpoint: string): Promise<T> {
    const res = await fetch(`${this.baseURL}${endpoint}`, {
      method: "GET",
      headers: this.buildHeaders(),
    });
    return this.processResponse<T>(res, "An error occurred while fetching the data.\n");
  }

  public async getUser<T>(userId: string): Promise<T> {
    const res = await fetch(`${this.baseURL}/users/${userId}`, {
      method: "GET",
      headers: this.buildHeaders(),
    });
    return this.processResponse<T>(res, "An error occurred while fetching the user data.\n");
  }

  public async getUsers<T>(): Promise<T> {
    const res = await fetch(`${this.baseURL}/users`, {
      method: "GET",
      headers: this.buildHeaders(),
    });
    return this.processResponse<T>(res, "An error occurred while fetching all users.\n");
  }

  public async getFriends<T>(userId: string): Promise<T> {
    const res = await fetch(`${this.baseURL}/users/${userId}/friends`, {
      method: "GET",
      headers: this.buildHeaders(),
    });
    return this.processResponse<T>(res, "An error occurred while fetching the friends data.\n");
  }

  public async getProjects<T>(userId: string): Promise<T> {
    const res = await fetch(`${this.baseURL}/users/${userId}/projects`, {
      method: "GET",
      headers: this.buildHeaders(),
    });
    return this.processResponse<T>(res, "An error occurred while fetching the project data.\n");
  }

  public async getDailyContributions<T = any>(projectId: string, days?: number): Promise<T> {
    const url = `${this.baseURL}/projects/${projectId}/changes/daily-contributions${
      days ? `?days=${encodeURIComponent(days)}` : ""
    }`;
    const res = await fetch(url, { method: "GET", headers: this.buildHeaders() });
    return this.processResponse<T>(res, "An error occurred while fetching contributions data.");
  }

  public async getMessages<T>(roomName: string): Promise<T> {
    const res = await fetch(`${this.baseURL}/projects/${roomName}/messages`, {
      method: "GET",
      headers: this.buildHeaders(),
    });
    return this.processResponse<T>(res, "An error occurred while fetching the messages.\n");
  }

  // ---------- POSTs ----------
  public async post<T>(endpoint: string, data: unknown): Promise<T> {
    const res = await fetch(`${this.baseURL}${endpoint}`, {
      method: "POST",
      headers: this.buildHeaders(),
      body: JSON.stringify(data),
    });
    return this.processResponse<T>(res, "An error occurred while posting the data.\n");
  }

  async checkEmailExists(email: string) {
    const response = await fetch(`${this.baseURL}/auth/check-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (!response.ok) throw new Error("Failed to check email");
    return response.json();
  }

  public async rawPost(endpoint: string, body: Record<string, unknown>): Promise<Response> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      const errorDetail = await response.text();
      throw new Error(`Request failed with status ${response.status}: ${errorDetail}`);
    }
    return response;
  }

  public async createProject<T>(
    projectName: string,
    projectDescription: string,
    projectLogoUrl: string,
    projectMembers: string[],
  ): Promise<T> {
    const res = await fetch(`${this.baseURL}/projects`, {
      method: "POST",
      headers: this.buildHeaders(),
      body: JSON.stringify({ projectName, projectDescription, projectLogoUrl, projectMembers }),
    });
    return this.processResponse<T>(res, "An error occurred while creating the project.\n");
  }

  public async postChanges<T>(changeType: string, projectId: string): Promise<T> {
    const res = await fetch(`${this.baseURL}/projects/${projectId}/changes`, {
      method: "POST",
      headers: this.buildHeaders(),
      body: JSON.stringify({ changeType }),
    });
    return this.processResponse<T>(res, "An error occurred while posting the changes.\n");
  }

  public async logOut(): Promise<void> {
    const res = await fetch(`${this.baseURL}/auth/logout`, {
      method: "POST",
      headers: { ...this.buildHeaders() },
    });
    return this.processResponse<void>(res, "An error occurred while logging out.\n");
  }

  public async sendMessage<T>(message: string, roomName: string): Promise<T> {
    const res = await fetch(`${this.baseURL}/projects/${roomName}/messages`, {
      method: "POST",
      headers: this.buildHeaders(),
      body: JSON.stringify({ content: message }),
    });
    return this.processResponse<T>(res, "An error occurred while sending the message.\n");
  }

  // ---------- PUTs ----------
  public async put<T>(endpoint: string, data: unknown, options?: { skipAuth?: boolean }): Promise<T> {
    const headers = options?.skipAuth ? this.defaultHeaders : this.buildHeaders();
    const res = await fetch(`${this.baseURL}${endpoint}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(data),
    });
    return this.processResponse<T>(res, "An error occurred while updating the data.\n");
  }

  public async updateUser<T>(userId: string, data: unknown): Promise<T> {
    const res = await fetch(`${this.baseURL}/users/${userId}`, {
      method: "PUT",
      headers: this.buildHeaders(),
      body: JSON.stringify(data),
    });
    return this.processResponse<T>(res, "An error occurred while updating the user data.\n");
  }

  public async sendFriendRequest<T>(userId: string, friendId: string): Promise<T> {
    const res = await fetch(`${this.baseURL}/users/${userId}/friends/invite/${friendId}`, {
      method: "POST",
      headers: this.buildHeaders(),
    });
    return this.processResponse<T>(res, "An error occurred while sending the friend request.\n");
  }

  public async acceptFriendRequest<T>(userId: string, friendId: string): Promise<T> {
    const res = await fetch(`${this.baseURL}/users/${userId}/friends/accept/${friendId}`, {
      method: "POST",
      headers: this.buildHeaders(),
    });
    return this.processResponse<T>(res, "An error occurred while accepting the friend request.\n");
  }

  public async rejectFriendRequest<T>(userId: string, friendId: string): Promise<T> {
    const res = await fetch(`${this.baseURL}/users/${userId}/friends/reject/${friendId}`, {
      method: "POST",
      headers: this.buildHeaders(),
    });
    return this.processResponse<T>(res, "An error occurred while rejecting the friend request.\n");
  }

  public async cancelFriendRequest<T>(userId: string, friendId: string): Promise<T> {
    const res = await fetch(`${this.baseURL}/users/${userId}/friends/cancel/${friendId}`, {
      method: "POST",
      headers: this.buildHeaders(),
    });
    return this.processResponse<T>(res, "An error occurred while cancelling the friend request.\n");
  }

  public async removeFriend<T>(userId: string, friendId: string): Promise<T> {
    const res = await fetch(`${this.baseURL}/users/${userId}/friends/remove/${friendId}`, {
      method: "POST",
      headers: this.buildHeaders(),
    });
    return this.processResponse<T>(res, "An error occurred while removing the friend.\n");
  }

  public async addFriendsToProject(projectId: string, members: string[]): Promise<void> {
    const res = await fetch(`${this.baseURL}/projects/${projectId}`, {
      method: "PUT",
      headers: this.buildHeaders(),
      body: JSON.stringify({ membersToAdd: members }),
    });
    return this.processResponse<void>(res, "An error occurred while adding friends to the project.\n");
  }

  public async removeFriendsFromProject(projectId: string, members: string[]): Promise<void> {
    const res = await fetch(`${this.baseURL}/projects/${projectId}`, {
      method: "PUT",
      headers: this.buildHeaders(),
      body: JSON.stringify({ membersToRemove: members }),
    });
    return this.processResponse<void>(res, "An error occurred while kicking friends from the project.\n");
  }

  public async leaveProject(projectId: string): Promise<void> {
    const res = await fetch(`${this.baseURL}/projects/${projectId}/members`, {
      method: "PUT",
      headers: this.buildHeaders(),
    });
    return this.processResponse<void>(res, "An error occurred while leaving the project.\n");
  }

  // ---------- Auth helpers ----------
  public async resetPasswordWithOTP(email: string, otp: string): Promise<any> {
    return this.put("/auth/reset-password-with-otp", { email, otp }, { skipAuth: true });
  }

  // ---------- DELETEs ----------
  public async delete<T>(endpoint: string): Promise<T> {
    const res = await fetch(`${this.baseURL}${endpoint}`, {
      method: "DELETE",
      headers: this.buildHeaders(),
    });
    return this.processResponse<T>(res, "An error occurred while deleting the data.\n");
  }

  public async deleteProjectChanges(projectId: string): Promise<void> {
    const res = await fetch(`${this.baseURL}/projects/${projectId}/changes`, {
      method: "DELETE",
      headers: this.buildHeaders(),
    });
    return this.processResponse<void>(res, "An error occurred while deleting the project changes.\n");
  }

  // ---------- AI ----------
  public async refineIdea(ideaContent: string): Promise<ApiResponse> {
    return this.post<ApiResponse>("/api/ai/refine", { ideaContent });
  }

  public async suggestWithTwist(originalIdea: string, twist: string): Promise<ApiResponse> {
    return this.post<ApiResponse>("/api/ai/twist", { originalIdea, twist });
  }

  public async combineIdeas(ideaOne: string, ideaTwo: string): Promise<ApiResponse> {
    return this.post<ApiResponse>("/api/ai/combine", { ideaOne, ideaTwo });
  }

  public async generateFromTemplate(template: string): Promise<ApiResponse> {
    return this.post<ApiResponse>("/api/ai/template", { template });
  }
}
