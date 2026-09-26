import { useEffect, useState } from "react";
import {
  subscribeToAssistanceRequests,
  createAssistanceRequest,
  updateAssistanceStatus,
} from "../services/assistanceService";

export const useAssistanceRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToAssistanceRequests((data) => {
      setRequests(data);
      setLoading(false);
    });

    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, []);

  const createRequest = async (request) => {
    return await createAssistanceRequest(request);
  };

  const updateStatus = async (requestId, status) => {
    return await updateAssistanceStatus(requestId, status);
  };

  return {
    requests,
    loading,
    createRequest,
    updateStatus,
  };
};