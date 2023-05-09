import axios from "axios";
import { useContext, useMemo } from "react";
import { AuthContext } from "../store/auth-context";

export const useAuthorizedApi = () => {
    const {
        handlers: { logOutHandler },
    } = useContext(AuthContext);

    const requests = useMemo(() => {
        const _checkRevokedToken = (error) => {
            console.log(error);
            if (
                error.response.status === 401 &&
                error.response.data.error === "RevokedTokenError"
            )
                setTimeout(() => logOutHandler(), 2000);
        };

        return {
            get: async (url) => {
                console.log("[getRequest]:");

                try {
                    const response = await axios.get(url);
                    if (response) return response;
                } catch (error) {
                    _checkRevokedToken(error);
                    throw error;
                }
            },
            post: async (url, options) => {
                console.log("[postRequest]:");

                try {
                    const response = await axios.post(url, options);
                    if (response) return response;
                } catch (error) {
                    _checkRevokedToken(error);
                    throw error;
                }
            },
            patch: async (url, options) => {
                console.log("[patchRequest]:");

                try {
                    const response = await axios.patch(url, options);
                    if (response) return response;
                } catch (error) {
                    _checkRevokedToken(error);
                    throw error;
                }
            },
            delete: async (url, options) => {
                console.log("[deleteRequest]:");

                try {
                    const response = await axios.delete(url, options);
                    if (response) return response;
                } catch (error) {
                    _checkRevokedToken(error);
                    throw error;
                }
            },
        };
    }, [logOutHandler]);

    return requests;
};
