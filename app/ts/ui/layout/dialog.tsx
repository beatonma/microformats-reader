import React, {
    Dispatch,
    ReactNode,
    SetStateAction,
    createContext,
    useContext,
    useEffect,
    useState,
    ComponentProps,
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
    const dialogContent = dialogState?.[0];

    return (
        <DialogContext.Provider value={dialogState}>
            <div id={ScrimId} data-visible={dialogContent !== undefined} />
            {props.children}
            <div id={DialogId} children={dialogContent} />
        </DialogContext.Provider>
    );
};

export interface DialogProps {
    open: boolean;
    onClose: () => void;
}
export const Dialog = (props: ComponentProps<"dialog"> & DialogProps) => {
    const { open, onClose, ...rest } = props;
    const [_, setDialog] = useContext(DialogContext);

    const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
            onClose();
        }
    };

    useEffect(() => {
        document.getElementById(ScrimId)?.addEventListener("click", onClose);
        window.addEventListener("keydown", onKeyDown);

        return () => {
            document
                .getElementById(ScrimId)
                ?.removeEventListener("click", onClose);
            window.removeEventListener("keydown", onKeyDown);
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
