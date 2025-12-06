#!/bin/bash

# 📱 Goldmonkey iOS Initializer
# Inicializa projetos SwiftUI com padrão Goldmonkey
# Uso: ./scripts/init-ios-swiftui.sh nome-do-projeto

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Emojis
ROCKET="🚀"
CHECK="✅"
FOLDER="📁"
APPLE="🍎"
CONFIG="⚙️"
FIRE="🔥"

# Banner
echo -e "${PURPLE}"
echo "╔════════════════════════════════════════╗"
echo "║   GOLDMONKEY iOS INITIALIZER v1.0     ║"
echo "║   SwiftUI + iOS 17+ Ultra-Pro         ║"
echo "╚════════════════════════════════════════╝"
echo -e "${NC}"

# Verificar se nome do projeto foi fornecido
if [ -z "$1" ]; then
    echo -e "${RED}❌ Erro: Nome do projeto não fornecido${NC}"
    echo -e "${YELLOW}Uso: ./scripts/init-ios-swiftui.sh nome-do-projeto${NC}"
    exit 1
fi

PROJECT_NAME=$1
PROJECT_DIR="$HOME/Projects/$PROJECT_NAME"

echo -e "${CYAN}${ROCKET} Iniciando criação do projeto iOS: ${YELLOW}$PROJECT_NAME${NC}\n"

# Verificar se Xcode está instalado
if ! command -v xcodebuild &> /dev/null; then
    echo -e "${RED}❌ Erro: Xcode não está instalado${NC}"
    echo -e "${YELLOW}Por favor, instale o Xcode pela App Store${NC}"
    exit 1
fi

# 1. Criar diretório do projeto
echo -e "${BLUE}${FOLDER} Criando estrutura de diretórios...${NC}"
if [ -d "$PROJECT_DIR" ]; then
    echo -e "${RED}❌ Erro: Diretório $PROJECT_DIR já existe${NC}"
    exit 1
fi
mkdir -p "$PROJECT_DIR"
cd "$PROJECT_DIR"
echo -e "${GREEN}${CHECK} Diretório criado: $PROJECT_DIR${NC}\n"

# 2. Inicializar Git
echo -e "${BLUE}${FOLDER} Inicializando Git...${NC}"
git init
echo -e "${GREEN}${CHECK} Git inicializado${NC}\n"

# 3. Criar estrutura de pastas Goldmonkey
echo -e "${BLUE}${FOLDER} Criando estrutura Goldmonkey...${NC}"
mkdir -p "$PROJECT_NAME/App"
mkdir -p "$PROJECT_NAME/Core/Models"
mkdir -p "$PROJECT_NAME/Core/Services"
mkdir -p "$PROJECT_NAME/Core/Networking"
mkdir -p "$PROJECT_NAME/Core/Utilities"
mkdir -p "$PROJECT_NAME/Features/Home/Views"
mkdir -p "$PROJECT_NAME/Features/Home/ViewModels"
mkdir -p "$PROJECT_NAME/UI/Components/Buttons"
mkdir -p "$PROJECT_NAME/UI/Components/Cards"
mkdir -p "$PROJECT_NAME/UI/Styles"
mkdir -p "$PROJECT_NAME/UI/Extensions"
mkdir -p "$PROJECT_NAME/Resources/Assets.xcassets"
mkdir -p "$PROJECT_NAME/Resources/Fonts"
mkdir -p "Tests/UnitTests"
mkdir -p "Tests/UITests"
echo -e "${GREEN}${CHECK} Estrutura de pastas criada${NC}\n"

# 4. Criar arquivos base
echo -e "${BLUE}${APPLE} Criando arquivos Swift base...${NC}"

# App Entry Point
cat > "$PROJECT_NAME/App/${PROJECT_NAME}App.swift" << EOF
import SwiftUI

@main
struct ${PROJECT_NAME}App: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}
EOF

# Content View
cat > "$PROJECT_NAME/Features/Home/Views/ContentView.swift" << EOF
import SwiftUI

struct ContentView: View {
    var body: some View {
        NavigationView {
            VStack(spacing: 20) {
                Image(systemName: "star.fill")
                    .font(.system(size: 60))
                    .foregroundColor(.gmPrimary)

                Text("Bem-vindo ao")
                    .font(.gmBody)
                    .foregroundColor(.gmTextSecondary)

                Text("$PROJECT_NAME")
                    .font(.gmH1)
                    .foregroundColor(.gmTextPrimary)

                GMButton(title: "Começar", style: .primary) {
                    print("Button tapped!")
                }
                .padding(.horizontal, 40)
            }
            .navigationTitle("Home")
        }
    }
}

#Preview {
    ContentView()
}
EOF

# Colors
cat > "$PROJECT_NAME/UI/Styles/Colors.swift" << EOF
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
EOF

# Typography
cat > "$PROJECT_NAME/UI/Styles/Typography.swift" << EOF
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
EOF

# Button Component
cat > "$PROJECT_NAME/UI/Components/Buttons/GMButton.swift" << EOF
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
EOF

echo -e "${GREEN}${CHECK} Arquivos Swift criados${NC}\n"

# 5. Criar .gitignore
echo -e "${BLUE}${CONFIG} Criando .gitignore...${NC}"
cat > .gitignore << 'EOF'
# Xcode
build/
*.pbxuser
!default.pbxuser
*.mode1v3
!default.mode1v3
*.mode2v3
!default.mode2v3
*.perspectivev3
!default.perspectivev3
xcuserdata/
*.xccheckout
*.moved-aside
DerivedData/
*.hmap
*.ipa
*.xcuserstate
*.xcscmblueprint

# Swift Package Manager
.build/
Packages/
Package.pins
Package.resolved
*.swiftpm

# CocoaPods
Pods/
*.lock

# Carthage
Carthage/Build/

# fastlane
fastlane/report.xml
fastlane/Preview.html
fastlane/screenshots/**/*.png
fastlane/test_output

# Code Injection
iOSInjectionProject/

# macOS
.DS_Store
.AppleDouble
.LSOverride

# Environment
.env
.env.local
*.xcconfig

# IDE
.vscode/
.idea/
*.swp
*.swo
*~
EOF
echo -e "${GREEN}${CHECK} .gitignore criado${NC}\n"

# 6. Criar README
echo -e "${BLUE}${FOLDER} Criando README...${NC}"
cat > README.md << EOF
# $PROJECT_NAME

Projeto iOS criado com o **Goldmonkey iOS Template** - SwiftUI Ultra-Pro.

## Stack

- SwiftUI
- iOS 17+
- Swift 5.9+
- MVVM Architecture
- Swift Package Manager

## Estrutura

\`\`\`
/App          → Entry point
/Core         → Business logic, models, services
/Features     → Feature modules (MVVM)
/UI           → Reusable components & styles
/Resources    → Assets, fonts, localization
/Tests        → Unit & UI tests
\`\`\`

## Como Começar

### 1. Abrir no Xcode

\`\`\`bash
cd $PROJECT_DIR
xed .
\`\`\`

### 2. Criar projeto Xcode

No Xcode:
1. File → New → Project
2. iOS → App
3. Interface: **SwiftUI**
4. Language: **Swift**
5. Salvar neste diretório: \`$PROJECT_DIR\`

### 3. Mover arquivos para o projeto

Arraste as pastas criadas pelo script para dentro do projeto Xcode:
- \`$PROJECT_NAME/\` folder → Adicionar ao target
- Organize groups conforme estrutura Goldmonkey

### 4. Configurar Assets

Em \`Assets.xcassets\`, criar Color Sets:
- Primary
- Secondary
- Accent
- Background
- Surface
- TextPrimary
- TextSecondary

### 5. Build & Run

Cmd+R para rodar no simulador

## Testing

\`\`\`bash
# Unit tests
xcodebuild test -scheme $PROJECT_NAME -destination 'platform=iOS Simulator,name=iPhone 15'

# UI tests
xcodebuild test -scheme ${PROJECT_NAME}UITests -destination 'platform=iOS Simulator,name=iPhone 15'
\`\`\`

## Deployment

### TestFlight
1. Archive (Product → Archive)
2. Distribute App → TestFlight
3. Upload to App Store Connect

### App Store
1. Prepare metadata in App Store Connect
2. Submit for Review
3. Release when approved

---

Criado com 💛 por **Goldmonkey Empire**
EOF
echo -e "${GREEN}${CHECK} README criado${NC}\n"

# 7. Commit inicial
echo -e "${BLUE}${FOLDER} Criando commit inicial...${NC}"
git add .
git commit -m "feat: Initialize Goldmonkey iOS Project

✨ Features:
- SwiftUI structure
- MVVM architecture
- Goldmonkey component library
- Custom color system
- Typography system
- Base UI components (GMButton)

🏗️ Structure:
- /App - Entry point
- /Core - Business logic
- /Features - MVVM modules
- /UI - Reusable components
- /Tests - Unit & UI tests

🚀 Generated with Goldmonkey iOS Template v1.0"
echo -e "${GREEN}${CHECK} Commit inicial criado${NC}\n"

# 8. Finalização
echo -e "${GREEN}"
echo "╔════════════════════════════════════════╗"
echo "║   ${FIRE} PROJETO CRIADO COM SUCESSO! ${FIRE}   ║"
echo "╚════════════════════════════════════════╝"
echo -e "${NC}"

echo -e "${CYAN}📍 Localização: ${YELLOW}$PROJECT_DIR${NC}"
echo -e "${CYAN}📱 Projeto: ${YELLOW}$PROJECT_NAME${NC}\n"

echo -e "${PURPLE}Próximos passos:${NC}"
echo -e "${YELLOW}1.${NC} cd $PROJECT_DIR"
echo -e "${YELLOW}2.${NC} xed . ${BLUE}(abre no Xcode)${NC}"
echo -e "${YELLOW}3.${NC} File → New → Project → App (SwiftUI)"
echo -e "${YELLOW}4.${NC} Salvar no diretório atual"
echo -e "${YELLOW}5.${NC} Adicionar pastas criadas ao projeto Xcode"
echo -e "${YELLOW}6.${NC} Configurar Assets (Color Sets)"
echo -e "${YELLOW}7.${NC} Build & Run! 📱\n"

echo -e "${BLUE}⚠️  Importante:${NC}"
echo -e "${YELLOW}•${NC} Adicionar Color Sets em Assets.xcassets"
echo -e "${YELLOW}•${NC} Verificar Deployment Target (iOS 17+)"
echo -e "${YELLOW}•${NC} Configurar Team/Signing\n"

echo -e "${GREEN}${FIRE} Goldmonkey Empire - Build Like a Pro ${FIRE}${NC}\n"

# Opcional: abrir no Xcode
read -p "Abrir projeto no Xcode agora? (y/N) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    cd "$PROJECT_DIR"
    xed .
fi
