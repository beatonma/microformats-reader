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
const DialogId = "dialog_container";

const DialogContext = createContext<
    [ReactNode, Dispatch<SetStateAction<ReactNode>>]
>([undefined, (_: ReactNode) => {}]);

interface ScrimProps {
    children?: ReactNode | undefined;
}
export const ScrimLayout = (props: ScrimProps) => {
    const dialogState = useState<ReactNode>(undefined);

    return (
        <DialogContext.Provider value={dialogState}>
            <div id={ScrimId} data-visible={dialogState[0] !== undefined} />
            {props.children}
            <div id={DialogId} children={dialogState[0]} />
        </DialogContext.Provider>
    );
};

export interface DialogProps {
    open: boolean;
    onClose: () => void;
}
export const Dialog = (props: HTMLProps<HTMLDialogElement> & DialogProps) => {
    const { open, onClose, ...rest } = props;
    const [_, setDialog] = useContext(DialogContext);

    useEffect(() => {
        document.getElementById(ScrimId)?.addEventListener("click", onClose);

        return () => {
            document
                .getElementById(ScrimId)
                ?.removeEventListener("click", onClose);
        };
    }, []);

    useEffect(() => {
        if (open) {
            setDialog(
                <dialog open={open} {...rest}>
                    {props.children}
                </dialog>,
            );
        } else {
            setDialog(undefined);
        }

        return () => setDialog(undefined);
    }, [open, props.children]);

    return null;
};
