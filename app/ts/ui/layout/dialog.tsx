import React, {
    Dispatch,
    HTMLProps,
    ReactNode,
    SetStateAction,
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

const ScrimId = "dialog_scrim";

export const DialogScrimContext = createContext<
    [boolean, Dispatch<SetStateAction<boolean>>]
>([false, (_: boolean) => {}]);

interface ScrimProps {
    children?: ReactNode | undefined;
}
export const ScrimLayout = (props: ScrimProps) => {
    const scrimState = useState<boolean>(false);
    const [showScrim, setShowScrim] = scrimState;

    return (
        <DialogScrimContext.Provider value={scrimState}>
            <div id={ScrimId} data-visible={showScrim} />
            {props.children}
        </DialogScrimContext.Provider>
    );
};

export interface DialogProps {
    open: boolean;
    onClose: () => void;
}
export const Dialog = (props: HTMLProps<HTMLDialogElement> & DialogProps) => {
    const [showScrim, setShowScrim] = useContext(DialogScrimContext);
    const { open, onClose, ...rest } = props;

    useEffect(() => {
        setShowScrim(open ?? false);
    }, [open]);

    useEffect(() => {
        document.getElementById(ScrimId)?.addEventListener("click", onClose);

        return () => {
            document
                .getElementById(ScrimId)
                ?.removeEventListener("click", onClose);
        };
    }, []);

    return <dialog open={open} {...rest} />;
};
