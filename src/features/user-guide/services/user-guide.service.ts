// src/features/user-guide/services/user-guide.service.ts

import {
  deleteUserGuideApi,
  getUserGuideByIdApi,
  getUserGuidesApi,
  postCreateUserGuideApi,
  postTrackUserGuideDownloadApi,
  putUpdateUserGuideApi,
} from "@/features/user-guide/api/user-guide.api";
import { DUMMY_USER_GUIDES } from "@/features/user-guide/constants/dummy-user-guides";
import type {
  CreateUserGuidePayload,
  UpdateUserGuidePayload,
  UserGuideItem,
  UserGuideListResponse,
  UserGuideQueryParams,
} from "@/features/user-guide/types/user-guide.type";

const USER_GUIDE_STORAGE_KEY = "volatil_user_guides_db";

const getLocalGuides = (): UserGuideItem[] => {
  if (typeof window === "undefined") return DUMMY_USER_GUIDES;
  try {
    const raw = window.localStorage.getItem(USER_GUIDE_STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(
        USER_GUIDE_STORAGE_KEY,
        JSON.stringify(DUMMY_USER_GUIDES),
      );
      return DUMMY_USER_GUIDES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : DUMMY_USER_GUIDES;
  } catch {
    return DUMMY_USER_GUIDES;
  }
};

const saveLocalGuides = (guides: UserGuideItem[]) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      USER_GUIDE_STORAGE_KEY,
      JSON.stringify(guides),
    );
  } catch {
    // ignore
  }
};

export const userGuideService = {
  getGuides: async (
    params?: UserGuideQueryParams,
    signal?: AbortSignal,
  ): Promise<UserGuideListResponse> => {
    try {
      const response = await getUserGuidesApi(params, signal);
      if (response && response.data) {
        return {
          items: response.data,
          total: response.pagination?.totalItems ?? response.data.length,
          page: response.pagination?.currentPage ?? 1,
          limit: response.pagination?.itemsPerPage ?? 10,
          totalPages: response.pagination?.totalPages ?? 1,
        };
      }
    } catch {
      // Fallback to local storage store for offline / preview demo mode
    }

    const localList = getLocalGuides();
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 10;
    const search = (params?.search ?? "").trim().toLowerCase();
    const category = params?.category;
    const targetRole = params?.targetRole;
    const isPublished = params?.isPublished;

    let filtered = [...localList];

    if (search) {
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(search) ||
          item.description.toLowerCase().includes(search) ||
          item.fileName.toLowerCase().includes(search) ||
          item.version.toLowerCase().includes(search),
      );
    }

    if (category && category !== "all") {
      filtered = filtered.filter((item) => item.category === category);
    }

    if (targetRole && targetRole !== "all") {
      filtered = filtered.filter(
        (item) => item.targetRole === targetRole || item.targetRole === "all",
      );
    }

    if (typeof isPublished === "boolean") {
      filtered = filtered.filter((item) => item.isPublished === isPublished);
    }

    filtered.sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );

    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const startIndex = (page - 1) * limit;
    const paginatedItems = filtered.slice(startIndex, startIndex + limit);

    return {
      items: paginatedItems,
      total,
      page,
      limit,
      totalPages,
    };
  },

  getGuideById: async (
    id: string,
    signal?: AbortSignal,
  ): Promise<UserGuideItem | null> => {
    try {
      const response = await getUserGuideByIdApi(id, signal);
      if (response && response.data) return response.data;
    } catch {
      // Fallback
    }

    const localList = getLocalGuides();
    return localList.find((item) => item.id === id) ?? null;
  },

  createGuide: async (
    payload: CreateUserGuidePayload,
    signal?: AbortSignal,
  ): Promise<UserGuideItem> => {
    try {
      const response = await postCreateUserGuideApi(payload, signal);
      if (response && response.data) return response.data;
    } catch {
      // Fallback
    }

    const localList = getLocalGuides();
    const newId = `guide-${Date.now()}`;
    const slug = payload.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const file = payload.file;
    const fileName = file?.name ?? payload.fileName ?? "Dokumen_Panduan.pdf";
    const fileSize = file?.size ?? payload.fileSize ?? 1048576;
    const fileType =
      fileName.split(".").pop()?.toLowerCase() ??
      payload.fileType ??
      "pdf";
    const fileUrl = file
      ? URL.createObjectURL(file)
      : (payload.fileUrl ?? `/docs/${fileName}`);

    const newGuide: UserGuideItem = {
      id: newId,
      title: payload.title,
      slug,
      description: payload.description,
      category: payload.category,
      targetRole: payload.targetRole,
      version: payload.version,
      fileName,
      fileUrl,
      fileSize,
      fileType,
      isPublished: payload.isPublished ?? true,
      downloadCount: 0,
      author: "Administrator Internal",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveLocalGuides([newGuide, ...localList]);
    return newGuide;
  },

  updateGuide: async (
    id: string,
    payload: UpdateUserGuidePayload,
    signal?: AbortSignal,
  ): Promise<UserGuideItem> => {
    try {
      const response = await putUpdateUserGuideApi(id, payload, signal);
      if (response && response.data) return response.data;
    } catch {
      // Fallback
    }

    const localList = getLocalGuides();
    const index = localList.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new Error("Dokumen panduan tidak ditemukan");
    }

    const existing = localList[index];
    const file = payload.file;
    const fileName = file?.name ?? payload.fileName ?? existing.fileName;
    const fileSize = file?.size ?? payload.fileSize ?? existing.fileSize;
    const fileType = file
      ? (file.name.split(".").pop()?.toLowerCase() ?? "pdf")
      : (payload.fileType ?? existing.fileType);
    const fileUrl = file
      ? URL.createObjectURL(file)
      : (payload.fileUrl ?? existing.fileUrl);

    const updated: UserGuideItem = {
      ...existing,
      ...payload,
      fileName,
      fileSize,
      fileType,
      fileUrl,
      updatedAt: new Date().toISOString(),
    };

    localList[index] = updated;
    saveLocalGuides(localList);
    return updated;
  },

  deleteGuide: async (
    id: string,
    signal?: AbortSignal,
  ): Promise<{ success: boolean }> => {
    try {
      await deleteUserGuideApi(id, signal);
    } catch {
      // Fallback
    }

    const localList = getLocalGuides();
    const filtered = localList.filter((item) => item.id !== id);
    saveLocalGuides(filtered);
    return { success: true };
  },

  trackDownload: async (
    id: string,
    signal?: AbortSignal,
  ): Promise<void> => {
    try {
      await postTrackUserGuideDownloadApi(id, signal);
    } catch {
      // ignore
    }

    const localList = getLocalGuides();
    const target = localList.find((item) => item.id === id);
    if (target) {
      target.downloadCount = (target.downloadCount ?? 0) + 1;
      saveLocalGuides(localList);
    }
  },
};

