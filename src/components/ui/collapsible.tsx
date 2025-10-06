import React, { useState, ReactNode } from "react"
import { View, Text, TouchableOpacity, Animated, StyleSheet } from "react-native"
import { ChevronDown, ChevronUp } from "lucide-react-native"

type CollapsibleProps = {
  children: ReactNode
  trigger: ReactNode
  initiallyOpen?: boolean
}

export function Collapsible({ children, trigger, initiallyOpen = false }: CollapsibleProps) {
  const [open, setOpen] = useState(initiallyOpen)
  const [animation] = React.useState(() => new Animated.Value(initiallyOpen ? 1 : 0))

  React.useEffect(() => {
    Animated.timing(animation, {
      toValue: open ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start()
  }, [open, animation])

  const heightInterpolate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 200], // içerik yüksekliği
  })

  return (
    <View>
      <TouchableOpacity
        onPress={() => setOpen(!open)}
        style={styles.trigger}
        activeOpacity={0.7}
      >
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          {trigger}
          {open ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </View>
      </TouchableOpacity>

      <Animated.View style={[styles.content, { height: heightInterpolate, overflow: "hidden" }]}>
        {children}
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  trigger: {
    padding: 12,
    backgroundColor: "#eee",
    borderRadius: 6,
  },
  content: {
    paddingHorizontal: 12,
  },
})
