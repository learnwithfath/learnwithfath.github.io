package dev.taskforge

import org.junit.Assert.assertEquals
import org.junit.Test

class AppStateTest {
    @Test fun defaultTitle() {
        assertEquals("TaskForge", AppState().title)
    }
}
