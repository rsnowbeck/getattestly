import * as React from "react";
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";

type RadixExtend<T> = T & { children?: React.ReactNode; className?: string; asChild?: boolean };

const Collapsible = CollapsiblePrimitive.Root;

const CollapsibleTrigger = React.forwardRef<
  HTMLButtonElement,
  RadixExtend<React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.CollapsibleTrigger>>
>((props, ref) => <CollapsiblePrimitive.CollapsibleTrigger ref={ref} {...props} />);
CollapsibleTrigger.displayName = "CollapsibleTrigger";

const CollapsibleContent = React.forwardRef<
  HTMLDivElement,
  RadixExtend<React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.CollapsibleContent>>
>((props, ref) => <CollapsiblePrimitive.CollapsibleContent ref={ref} {...props} />);
CollapsibleContent.displayName = "CollapsibleContent";

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
