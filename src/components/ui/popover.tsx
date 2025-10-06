import React, { useState, useRef } from "react"
import { View, TouchableOpacity, StyleSheet, ViewProps } from "react-native"
import Popover from "react-native-popover-view"

interface RNPopoverProps extends ViewProps {
  trigger: React.ReactNode
  children: React.ReactNode
  popoverStyle?: object
}

export function RNPopover({ trigger, children, popoverStyle, ...props }: RNPopoverProps) {
  const [isVisible, setIsVisible] = useState(false)
  const touchableRef = useRef<View>(null)

  return (
    <View {...props}>
      <TouchableOpacity onPress={() => setIsVisible(true)}>
        <View ref={touchableRef}>{trigger}</View>
      </TouchableOpacity>

      <Popover
        isVisible={isVisible}
        from={touchableRef.current as any}  
        onRequestClose={() => setIsVisible(false)}
        popoverStyle={[styles.popover, popoverStyle]}
      >
        {children}
      </Popover>
    </View>
  )
}

const styles = StyleSheet.create({
  popover: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
})
