import Testing
@testable import TaskForge

@Test func defaultTitle() {
    #expect(AppState().title == "TaskForge")
}
