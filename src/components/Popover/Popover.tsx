import React, { useRef, useState, useId, ElementType } from 'react'
import { arrow, FloatingPortal, offset, shift, useFloating, type Placement } from '@floating-ui/react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  children: React.ReactNode
  renderPopover: React.ReactNode
  className?: string
  as?: ElementType
  initialOpen?: boolean
  placement?: Placement
}
const Popover = ({ children, renderPopover, placement, className, initialOpen, as: Element = 'div' }: Props) => {
  const id = useId()
  const arrowRef = useRef<HTMLElement>(null)
  const { x, y, strategy, refs, middlewareData } = useFloating({
    middleware: [offset(6), shift(), arrow({ element: arrowRef })],
    placement: placement
  })

  const [show, setShow] = useState<boolean>(initialOpen || false)
  const showPopover = () => {
    setShow(true)
  }
  const hidePopover = () => {
    setShow(false)
  }
  return (
    <Element className={className} onMouseEnter={showPopover} onMouseLeave={hidePopover} ref={refs.setReference}>
      {children}

      <FloatingPortal id={id}>
        <AnimatePresence>
          {show && (
            <motion.div
              animate={{ opacity: 1, transform: 'scale(1)' }}
              exit={{ opacity: 0, transform: 'scale(0)' }}
              initial={{ opacity: 0, transform: 'scale(0)' }}
              transition={{ ease: 'easeOut', duration: 0.2 }}
              ref={refs.setFloating}
              style={{
                position: strategy,
                top: y ?? 0,
                left: x ?? 0,
                width: 'max-content',
                transformOrigin: `${middlewareData.arrow?.x}px top`
              }}
            >
              <span
                ref={arrowRef}
                className='absolute z-10 -translate-y-[95%] border-[11px] border-x-transparent border-t-transparent border-b-white'
                style={{
                  left: middlewareData.arrow?.x,
                  right: middlewareData.arrow?.y
                }}
              ></span>

              {renderPopover}
            </motion.div>
          )}
        </AnimatePresence>
      </FloatingPortal>
    </Element>
  )
}

export default Popover
