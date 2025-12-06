# 📱 Goldmonkey iOS Template - SwiftUI
## Padrão para Projetos iOS do Império

---

## 📋 Stack Oficial

- **Framework**: SwiftUI
- **Platform**: iOS 17+
- **Language**: Swift 5.9+
- **Architecture**: MVVM / Clean Architecture
- **Package Manager**: Swift Package Manager (SPM)
- **IDE**: Xcode 15+

---

## 🏗️ Estrutura de Pastas Goldmonkey

```
ProjectName/
├── App/
│   ├── ProjectNameApp.swift      # App entry point
│   └── AppDelegate.swift         # (se necessário)
│
├── Core/
│   ├── Models/                   # Data models
│   ├── Services/                 # Business logic
│   ├── Networking/               # API layer
│   └── Utilities/                # Helper functions
│
├── Features/
│   ├── Home/
│   │   ├── Views/
│   │   ├── ViewModels/
│   │   └── Models/
│   ├── Profile/
│   └── (outras features...)
│
├── UI/
│   ├── Components/               # Componentes reutilizáveis
│   │   ├── Buttons/
│   │   ├── Cards/
│   │   └── TextFields/
│   ├── Styles/                   # Cores, fontes, etc
│   └── Extensions/               # UI Extensions
│
├── Resources/
│   ├── Assets.xcassets/          # Imagens, ícones
│   ├── Fonts/                    # Fontes customizadas
│   └── Localization/             # i18n strings
│
└── Tests/
    ├── UnitTests/
    └── UITests/
```

---

## ⚙️ Configurações Padrão

### 1. Info.plist Essentials

```xml
<key>UIApplicationSceneManifest</key>
<dict>
    <key>UIApplicationSupportsMultipleScenes</key>
    <true/>
</dict>

<key>CFBundleDisplayName</key>
<string>$(APP_DISPLAY_NAME)</string>

<key>UILaunchScreen</key>
<dict>
    <key>UIImageName</key>
    <string>LaunchImage</string>
</dict>
```

### 2. Build Settings

- **Deployment Target**: iOS 17.0
- **Swift Language Version**: Swift 5
- **Enable Bitcode**: No (deprecated)
- **Signing**: Automatic

### 3. Swift Package Dependencies (Recomendadas)

```swift
// Package.swift
dependencies: [
    // Networking
    .package(url: "https://github.com/Alamofire/Alamofire.git", from: "5.8.0"),

    // Storage
    .package(url: "https://github.com/realm/realm-swift.git", from: "10.45.0"),

    // UI Utilities
    .package(url: "https://github.com/kean/Nuke.git", from: "12.0.0"),
]
```

---

## 🎨 Componentes Base (UI Kit)

### Color System (`UI/Styles/Colors.swift`)

```swift
import SwiftUI

extension Color {
    // Primary Colors
    static let gmPrimary = Color("Primary")
    static let gmSecondary = Color("Secondary")
    static let gmAccent = Color("Accent")

    // Neutrals
    static let gmBackground = Color("Background")
    static let gmSurface = Color("Surface")
    static let gmTextPrimary = Color("TextPrimary")
    static let gmTextSecondary = Color("TextSecondary")

    // Semantic Colors
    static let gmSuccess = Color.green
    static let gmError = Color.red
    static let gmWarning = Color.orange
}
```

### Typography (`UI/Styles/Typography.swift`)

```swift
import SwiftUI

extension Font {
    // Headlines
    static let gmH1 = Font.system(size: 32, weight: .bold)
    static let gmH2 = Font.system(size: 24, weight: .semibold)
    static let gmH3 = Font.system(size: 20, weight: .semibold)

    // Body
    static let gmBody = Font.system(size: 16, weight: .regular)
    static let gmBodyBold = Font.system(size: 16, weight: .semibold)

    // Small
    static let gmCaption = Font.system(size: 12, weight: .regular)
    static let gmSmall = Font.system(size: 14, weight: .regular)
}
```

### Button Component (`UI/Components/Buttons/GMButton.swift`)

```swift
import SwiftUI

struct GMButton: View {
    let title: String
    let style: ButtonStyle
    let action: () -> Void

    enum ButtonStyle {
        case primary
        case secondary
        case outline
    }

    var body: some View {
        Button(action: action) {
            Text(title)
                .font(.gmBodyBold)
                .foregroundColor(textColor)
                .frame(maxWidth: .infinity)
                .padding()
                .background(backgroundColor)
                .cornerRadius(12)
                .overlay(
                    RoundedRectangle(cornerRadius: 12)
                        .stroke(borderColor, lineWidth: style == .outline ? 2 : 0)
                )
        }
    }

    private var backgroundColor: Color {
        switch style {
        case .primary: return .gmPrimary
        case .secondary: return .gmSecondary
        case .outline: return .clear
        }
    }

    private var textColor: Color {
        switch style {
        case .primary, .secondary: return .white
        case .outline: return .gmPrimary
        }
    }

    private var borderColor: Color {
        style == .outline ? .gmPrimary : .clear
    }
}
```

### Card Component (`UI/Components/Cards/GMCard.swift`)

```swift
import SwiftUI

struct GMCard<Content: View>: View {
    let content: Content

    init(@ViewBuilder content: () -> Content) {
        self.content = content()
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            content
        }
        .padding()
        .background(Color.gmSurface)
        .cornerRadius(16)
        .shadow(color: .black.opacity(0.1), radius: 10, x: 0, y: 4)
    }
}
```

---

## 🏛️ Architecture Pattern (MVVM)

### Model Example

```swift
// Core/Models/User.swift
struct User: Codable, Identifiable {
    let id: String
    let name: String
    let email: String
    let avatarURL: String?

    enum CodingKeys: String, CodingKey {
        case id
        case name
        case email
        case avatarURL = "avatar_url"
    }
}
```

### ViewModel Example

```swift
// Features/Profile/ViewModels/ProfileViewModel.swift
import SwiftUI
import Combine

@MainActor
class ProfileViewModel: ObservableObject {
    @Published var user: User?
    @Published var isLoading = false
    @Published var errorMessage: String?

    private let userService: UserServiceProtocol
    private var cancellables = Set<AnyCancellable>()

    init(userService: UserServiceProtocol = UserService()) {
        self.userService = userService
    }

    func loadProfile() async {
        isLoading = true
        defer { isLoading = false }

        do {
            user = try await userService.fetchCurrentUser()
        } catch {
            errorMessage = error.localizedDescription
        }
    }
}
```

### View Example

```swift
// Features/Profile/Views/ProfileView.swift
import SwiftUI

struct ProfileView: View {
    @StateObject private var viewModel = ProfileViewModel()

    var body: some View {
        NavigationView {
            ZStack {
                if viewModel.isLoading {
                    ProgressView()
                } else if let user = viewModel.user {
                    profileContent(user)
                } else if let error = viewModel.errorMessage {
                    errorView(error)
                }
            }
            .navigationTitle("Perfil")
            .task {
                await viewModel.loadProfile()
            }
        }
    }

    @ViewBuilder
    private func profileContent(_ user: User) -> some View {
        VStack(spacing: 20) {
            AsyncImage(url: URL(string: user.avatarURL ?? "")) { image in
                image.resizable()
            } placeholder: {
                Color.gray
            }
            .frame(width: 100, height: 100)
            .clipShape(Circle())

            Text(user.name)
                .font(.gmH2)

            Text(user.email)
                .font(.gmBody)
                .foregroundColor(.gmTextSecondary)
        }
        .padding()
    }

    @ViewBuilder
    private func errorView(_ message: String) -> some View {
        VStack {
            Text("Erro")
                .font(.gmH3)
            Text(message)
                .font(.gmBody)
                .foregroundColor(.gmError)
        }
    }
}
```

---

## 🌐 Networking Layer

### API Service Example

```swift
// Core/Networking/APIService.swift
import Foundation

protocol APIServiceProtocol {
    func request<T: Decodable>(_ endpoint: Endpoint) async throws -> T
}

class APIService: APIServiceProtocol {
    private let baseURL = "https://api.yourapp.com"

    func request<T: Decodable>(_ endpoint: Endpoint) async throws -> T {
        guard let url = URL(string: baseURL + endpoint.path) else {
            throw APIError.invalidURL
        }

        var request = URLRequest(url: url)
        request.httpMethod = endpoint.method.rawValue

        // Add headers
        endpoint.headers?.forEach { request.setValue($0.value, forHTTPHeaderField: $0.key) }

        // Add body
        if let body = endpoint.body {
            request.httpBody = try JSONEncoder().encode(body)
            request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        }

        let (data, response) = try await URLSession.shared.data(for: request)

        guard let httpResponse = response as? HTTPURLResponse else {
            throw APIError.invalidResponse
        }

        guard (200...299).contains(httpResponse.statusCode) else {
            throw APIError.serverError(httpResponse.statusCode)
        }

        return try JSONDecoder().decode(T.self, from: data)
    }
}

enum APIError: Error {
    case invalidURL
    case invalidResponse
    case serverError(Int)
}

struct Endpoint {
    let path: String
    let method: HTTPMethod
    let headers: [String: String]?
    let body: Encodable?
}

enum HTTPMethod: String {
    case get = "GET"
    case post = "POST"
    case put = "PUT"
    case delete = "DELETE"
}
```

---

## 💾 Local Storage (UserDefaults Wrapper)

```swift
// Core/Services/StorageService.swift
import Foundation

@propertyWrapper
struct AppStorage<T: Codable> {
    let key: String
    let defaultValue: T

    var wrappedValue: T {
        get {
            guard let data = UserDefaults.standard.data(forKey: key),
                  let value = try? JSONDecoder().decode(T.self, from: data) else {
                return defaultValue
            }
            return value
        }
        set {
            let data = try? JSONEncoder().encode(newValue)
            UserDefaults.standard.set(data, forKey: key)
        }
    }
}
```

---

## 🧪 Testing

### Unit Test Example

```swift
// Tests/UnitTests/ProfileViewModelTests.swift
import XCTest
@testable import YourApp

final class ProfileViewModelTests: XCTestCase {
    var sut: ProfileViewModel!
    var mockUserService: MockUserService!

    override func setUp() {
        super.setUp()
        mockUserService = MockUserService()
        sut = ProfileViewModel(userService: mockUserService)
    }

    override func tearDown() {
        sut = nil
        mockUserService = nil
        super.tearDown()
    }

    func testLoadProfile_Success() async {
        // Given
        let expectedUser = User(id: "1", name: "Test", email: "test@test.com", avatarURL: nil)
        mockUserService.mockUser = expectedUser

        // When
        await sut.loadProfile()

        // Then
        XCTAssertEqual(sut.user?.id, expectedUser.id)
        XCTAssertFalse(sut.isLoading)
        XCTAssertNil(sut.errorMessage)
    }
}
```

---

## 📱 App Entry Point

```swift
// App/ProjectNameApp.swift
import SwiftUI

@main
struct ProjectNameApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}
```

---

## 🎯 Best Practices Goldmonkey iOS

### 1. Performance
- Use `@State` apenas para estado local da view
- Use `@StateObject` para ViewModels
- Use `@ObservedObject` quando o objeto vem de fora
- Implemente lazy loading em listas longas

### 2. Code Quality
- Sempre use Type Safety (evite `Any`)
- Prefira `struct` sobre `class` quando possível
- Use `async/await` ao invés de closures para networking
- Mantenha ViewModels testáveis (dependency injection)

### 3. UI/UX
- Sempre teste em diferentes tamanhos de tela
- Use `GeometryReader` com moderação
- Implemente Dark Mode
- Adicione animações sutis com `.animation()`

### 4. Security
- Use Keychain para dados sensíveis
- Nunca commite API keys no código
- Use environment variables (.xcconfig)
- Implemente Certificate Pinning para APIs críticas

### 5. Git Flow (iOS)
- `main` → App Store releases
- `develop` → TestFlight builds
- Feature branches → `feature/nome-da-feature`
- Commits semânticos: `feat:`, `fix:`, `refactor:`, `test:`

---

## 🚀 Deployment (App Store)

### 1. Configuração Inicial
- Criar App ID no Apple Developer
- Configurar Certificates & Provisioning Profiles
- Criar app no App Store Connect

### 2. Build para TestFlight
```bash
# Archive
xcodebuild archive \
  -scheme YourApp \
  -archivePath ./build/YourApp.xcarchive

# Export IPA
xcodebuild -exportArchive \
  -archivePath ./build/YourApp.xcarchive \
  -exportPath ./build \
  -exportOptionsPlist ExportOptions.plist
```

### 3. Upload
- Via Xcode Organizer
- Ou via `xcrun altool` (CI/CD)

### 4. TestFlight
- Adicionar testers internos/externos
- Configurar builds para testes
- Coletar feedback

### 5. Produção
- Submeter para review
- Configurar App Store metadata
- Screenshots (todos os tamanhos)
- Release manual ou automático

---

## 📚 Recursos Essenciais

- [SwiftUI Documentation](https://developer.apple.com/documentation/swiftui)
- [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [Swift.org](https://swift.org/documentation/)
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)

---

## 🏆 Template Goldmonkey iOS

Este template representa o padrão de excelência Goldmonkey para projetos iOS.

**Criado por**: Goldmonkey Empire
**Última atualização**: 2025-12-06
**Versão**: 1.0.0

---

**Para inicializar um projeto com este template, use:**
```bash
./scripts/init-ios-swiftui.sh nome-do-projeto
```
