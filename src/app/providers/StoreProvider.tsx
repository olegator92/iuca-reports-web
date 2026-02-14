import { type ReactNode } from "react"
import { Provider } from "react-redux"
import { mainStore } from "../stores/mainStore"

export const StoreProvider = ({children}: {children: ReactNode}) => {
    return <Provider store={mainStore}>{children}</Provider>
}