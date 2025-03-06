import CommissionContextProvider from "./CommissionContext";
import CommissionBody from "./CommissionBody"

export default function Commission(){
    return(
        <CommissionContextProvider>
            <CommissionBody />
        </CommissionContextProvider>
    )
}