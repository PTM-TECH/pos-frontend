import api from "@/lib/api";
import { ApiResponse, Subscription } from "@/types";

export async function getSubscriptions() {
  const response =
    await api.get<ApiResponse<Subscription[]>>("/subscriptions/");
  return response.data.data;
}

export interface SubscriptionPayload {
  member_id: number;
  name: string;
  type: "daily" | "weekly" | "monthly";
  time: string;
}

export async function createSubscription(payload: SubscriptionPayload) {
  const response = await api.post<ApiResponse<Subscription>>(
    "/subscriptions/",
    payload,
  );
  return response.data.data;
}

export async function updateSubscription(
  id: number,
  payload: Partial<SubscriptionPayload>,
) {
  const response = await api.patch<ApiResponse<Subscription>>(
    `/subscriptions/${id}`,
    payload,
  );
  return response.data.data;
}

export async function deleteSubscription(id: number) {
  await api.delete(`/subscriptions/${id}`);
}
