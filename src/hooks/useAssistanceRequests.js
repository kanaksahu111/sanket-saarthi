import { useEffect, useState } from "react";
import {
  subscribeToAssistanceRequests,
  createAssistanceRequest,
  updateAssistanceStatus,
} from "../services/assistanceService";

const DEMO_MODE = false;

export const useAssistanceRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (DEMO_MODE) {
      setRequests([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const unsubscribe = subscribeToAssistanceRequests((data) => {
      setRequests(data);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const createRequest = async (request) => {
    console.log("createRequest called:", request);
    if (DEMO_MODE) {
      const newRequest = {
        id: `demo-${Date.now()}`,
        ...request,
        status: "PENDING",
      };

      setRequests((currentRequests) => [
        ...currentRequests,
        newRequest,
      ]);

      return newRequest.id;
    }

    return await createAssistanceRequest(request);
  };

  const updateStatus = async (requestId, status) => {
    if (DEMO_MODE) {
      setRequests((currentRequests) =>
        currentRequests.map((request) =>
          request.id === requestId
            ? { ...request, status }
            : request
        )
      );

      return;
    }

    return await updateAssistanceStatus(requestId, status);
  };

  return {
    requests,
    loading,
    createRequest,
    updateStatus,
  };
};