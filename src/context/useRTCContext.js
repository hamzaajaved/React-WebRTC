import { useContext } from "react";
import RTCContext from "./RTCContext";

const useRTCContext = () => {
    const context = useContext(RTCContext);

    return context;
};

export default useRTCContext;
