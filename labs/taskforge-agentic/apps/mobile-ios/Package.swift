// swift-tools-version: 6.0
import PackageDescription

let package = Package(
    name: "TaskForge",
    platforms: [.macOS(.v14), .iOS(.v17)],
    products: [.library(name: "TaskForge", targets: ["TaskForge"])],
    targets: [
        .target(name: "TaskForge"),
        .testTarget(name: "TaskForgeTests", dependencies: ["TaskForge"]),
    ]
)
