/* eslint-disable */
import { getApiDomain } from "@/utils/domain";
import { ApplicationError } from "@/types/error";

export class ApiService {
  private baseURL: string;
  private defaultHeaders: HeadersInit;

  constructor() {
    this.baseURL = getApiDomain();
    this.defaultHeaders = {
      "Content-Type": "application/json"
    };
  }

  /**
   * Helper function to check the response, parse JSON,
   * and throw an error if the response is not OK.
   *
   * @param res - The response from fetch.
   * @param errorMessage - A descriptive error message for this call.
   * @returns Parsed JSON data.
   * @throws ApplicationError if res.ok is false.
   */
  //Including token to get access
  private buildHeaders(): HeadersInit {
    const token = sessionStorage.getItem("token"); 
    return {
      ...this.defaultHeaders,
      ...(token ? { Authorization: token } : {}),
    };
  }
  
  private async processResponse<T>(
    res: Response,
    errorMessage: string,
  ): Promise<T> {
    if (!res.ok) {
      let errorDetail = res.statusText;
      try {
        const errorInfo = await res.json();
        if (errorInfo?.message) {
          errorDetail = errorInfo.message;
        } else {
          errorDetail = JSON.stringify(errorInfo);
        }
      } catch {
        // If parsing fails, keep using res.statusText
      }
      const detailedMessage = `${errorMessage} (${res.status}: ${errorDetail})`;
      const error: ApplicationError = new Error(
        detailedMessage,
      ) as ApplicationError;
      error.info = JSON.stringify(
        { status: res.status, statusText: res.statusText },
        null,
        2,
      );
      error.status = res.status;
      throw error;
    }
    return res.headers.get("Content-Type")?.includes("application/json")
      ? res.json() as Promise<T>
      : Promise.resolve(res as T);
  }

  /**
   * GET request.
   * @param endpoint - The API endpoint (e.g. "/users").
   * @returns JSON data of type T.
   */
  public async get<T>(endpoint: string): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const res = await fetch(url, {
      method: "GET",
      headers: this.buildHeaders(),
    });
    
    return this.processResponse<T>(
      res,
      "An error occurred while fetching the data.\n",
    );
  }

  public async getUser<T>(userId: string): Promise<T> {
    const url = `${this.baseURL}${'/users/'}${userId}`;
    const res = await fetch(url, {
      method: "GET",
      headers: this.buildHeaders(),
    });
    return this.processResponse<T>(
      res,
      "An error occurred while fetching the user data.\n",
    );
  }

  public async getUsers<T>(): Promise<T> {
    const url = `${this.baseURL}/users`;
    const res = await fetch(url, {
      method: "GET",
      headers: this.buildHeaders(),
    });
  
    return this.processResponse<T>(
      res,
      "An error occurred while fetching all users.\n"
    );
  }
  
  public async getFriends<T>(userId: string): Promise<T> {
    const url = `${this.baseURL}${'/users/'}${userId}/friends`;
    const res = await fetch(url, {
      method: "GET",
      headers: this.buildHeaders(),
    });
    return this.processResponse<T>(
      res,
      "An error occurred while fetching the friends data.\n",
    );
  }

  public async getProjects<T>(userId: string): Promise<T> {
    const url = `${this.baseURL}${`/users/`}${userId}/projects`;
    const res = await fetch(url, {
      method: "GET",
      headers: this.buildHeaders(),
    });
    return this.processResponse<T>(
      res,
      "An error occurred while fetching the project data.\n",
    );
  }

  public async getDailyContributions<T = any>(
    projectId: string,
    days?: number
  ): Promise<T> {
    const url = new URL(`${this.baseURL}/projects/${projectId}/changes/daily-contributions`);
    
    if (days) {
      url.searchParams.append('days', days.toString());
    }

    const res = await fetch(url.toString(), {
      method: "GET",
      headers: this.buildHeaders(),
    });
    
    return this.processResponse<T>(
      res,
      "An error occurred while fetching contributions data.",
    );
  }

  public async getMessages<T>(roomName: string): Promise<T> {
    const url = `${this.baseURL}/projects/${roomName}/messages`;
    const res = await fetch(url, {
      method: "GET",
      headers: this.buildHeaders(),
    });
    return this.processResponse<T>(
      res,
      "An error occurred while fetching the messages.\n",
    );
  }

  /**
   * POST request.
   * @param endpoint - The API endpoint (e.g. "/users").
   * @param data - The payload to post.
   * @returns JSON data of type T.
   */
  public async post<T>(endpoint: string, data: unknown): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const res = await fetch(url, {
      method: "POST",
      headers: this.buildHeaders(),
      body: JSON.stringify(data),
    });
    return this.processResponse<T>(
      res,
      "An error occurred while posting the data.\n",
    );
  }

  public async rawPost(endpoint: string, body: Record<string, unknown>): Promise<Response> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  
    if (!response.ok) {
      const errorDetail = await response.text();
      throw new Error(`Request failed with status ${response.status}: ${errorDetail}`);
    }
  
    return response;
  }

  public async createProject<T>(projectName: string, projectDescription: string, projectLogoUrl: string, projectMembers: string[]): Promise<T> {
    const url = `${this.baseURL}/projects`;
    const res = await fetch(url, {
      method: "POST",
      headers: this.buildHeaders(),
      body: JSON.stringify({
        projectName,
        projectDescription,
        projectLogoUrl,
        projectMembers,
      }),
    });
    return this.processResponse<T>(
      res,
      "An error occurred while creating the project.\n",
    );
  }

  public async postChanges<T>( changeType: string, projectId: string): Promise<T> {
    const url = `${this.baseURL}${`/projects/`}${projectId}/changes`;
    const res = await fetch(url, {
      method: "POST",
      headers: this.buildHeaders(),
      body: JSON.stringify({ "changeType": changeType }),
    });
    return this.processResponse<T>(
      res,
      "An error occurred while posting the changes.\n",
    );
  }

  public async logOut(): Promise<void> {
    const url = `${this.baseURL}/auth/logout`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        ...this.buildHeaders(),
      },
    });
    return this.processResponse<void>(
      res,
      "An error occurred while logging out.\n",
    );
  }

  public async sendMessage<T>(message: string, roomName: string): Promise<T> {
    const url = `${this.baseURL}/projects/${roomName}/messages`;
    const res = await fetch(url, {
      method: "POST",
      headers: this.buildHeaders(),
      body: JSON.stringify( { "content":message } ),
    });
    return this.processResponse<T>(
      res,
      "An error occurred while sending the message.\n",
    );
  }
  
  /**
   * PUT request.
   * @param endpoint - The API endpoint (e.g. "/users/123").
   * @param data - The payload to update.
   * @returns JSON data of type T.
   */
  public async put<T>(endpoint: string, data: unknown): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const res = await fetch(url, {
      method: "PUT",
      headers: this.buildHeaders(),
      body: JSON.stringify(data),
    });
    return this.processResponse<T>(
      res,
      "An error occurred while updating the data.\n",
    );
  }

  public async updateUser<T>(userId: string, data: unknown): Promise<T> {
    const url = `${this.baseURL}${'/users/'}${userId}`;
    const res = await fetch(url, {
      method: "PUT",
      headers: this.buildHeaders(),
      body: JSON.stringify(data),
    });
    return this.processResponse<T>(
      res,
      "An error occurred while updating the user data.\n",
    );
  }

  public async sendFriendRequest<T>(userId: string, friendId: string): Promise<T> {
    const url = `${this.baseURL}/users/${userId}/friends/invite/${friendId}`;
    const res = await fetch(url, {
      method: "POST",
      headers: this.buildHeaders(),
    });
    return this.processResponse<T>(
      res,
      "An error occurred while sending the friend request.\n",
    );
  }

  public async acceptFriendRequest<T>(userId: string, friendId: string): Promise<T> {
    const url = `${this.baseURL}/users/${userId}/friends/accept/${friendId}`;
    const res = await fetch(url, {
      method: "POST",
      headers: this.buildHeaders(),
    });
    return this.processResponse<T>(
      res,
      "An error occurred while accepting the friend request.\n",
    );
  }

  public async rejectFriendRequest<T>(userId: string, friendId: string): Promise<T> {
    const url = `${this.baseURL}/users/${userId}/friends/reject/${friendId}`;
    const res = await fetch(url, {
      method: "POST",
      headers: this.buildHeaders(),
    });
    return this.processResponse<T>(
      res,
      "An error occurred while rejecting the friend request.\n",
    );
  }

  public async cancelFriendRequest<T>(userId: string, friendId: string): Promise<T> {
    const url = `${this.baseURL}/users/${userId}/friends/cancel/${friendId}`;
    const res = await fetch(url, {
      method: "POST",
      headers: this.buildHeaders(),
    });
    return this.processResponse<T>(
      res,
      "An error occurred while cancelling the friend request.\n",
    );
  }

  public async removeFriend<T>(userId: string, friendId: string): Promise<T> {
    const url = `${this.baseURL}/users/${userId}/friends/remove/${friendId}`;
    const res = await fetch(url, {
      method: "POST",
      headers: this.buildHeaders(),
    });
    return this.processResponse<T>(
      res,
      "An error occurred while removing the friend.\n",
    );
  }

  public async addFriendsToProject(projectId: string, members: string[]): Promise<void> {
    const url = `${this.baseURL}/projects/${projectId}`;
    const res = await fetch(url, {
      method: "PUT",
      headers: this.buildHeaders(),
      body: JSON.stringify({ "membersToAdd": members })
    });
    return this.processResponse<void>(
      res,
      "An error occurred while adding friends to the project.\n",
    );
  }

  public async removeFriendsFromProject(projectId: string, members: string[]): Promise<void> {
    const url = `${this.baseURL}/projects/${projectId}`;
    const res = await fetch(url, {
      method: "PUT",
      headers: this.buildHeaders(),
      body: JSON.stringify({ "membersToRemove": members })
    });
    return this.processResponse<void>(
      res,
      "An error occurred while kicking friends from the project.\n",
    );
  }

  public async leaveProject(projectId: string): Promise<void> {
    const url = `${this.baseURL}/projects/${projectId}/members`;
    const res = await fetch(url, {
      method: "PUT",
      headers: this.buildHeaders(),
    });
    return this.processResponse<void>(
      res,
      "An error occurred while leaving the project.\n",
    );
  }

  /**
   * DELETE request.
   * @param endpoint - The API endpoint (e.g. "/users/123").
   * @returns JSON data of type T.
   */
  public async delete<T>(endpoint: string): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const res = await fetch(url, {
      method: "DELETE",
      headers: this.buildHeaders(),
    });
    return this.processResponse<T>(
      res,
      "An error occurred while deleting the data.\n",
    );
  }

  public async deleteProjectChanges(projectId: string): Promise<void> {
    const url = `${this.baseURL}${`/projects/`}${projectId}/changes`;
    const res = await fetch(url, {
      method: "DELETE",
      headers: this.buildHeaders(),
    });
    return this.processResponse<void>(
      res,
      "An error occurred while deleting the project changes.\n",
    );
  }


}
