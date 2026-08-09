public struct AppState: Sendable, Equatable {
    public let title: String

    public init(title: String = "TaskForge") {
        self.title = title
    }
}
