summary: Part 5 dari seri Ekosistem Google Antigravity — Antigravity SDK (Python). Instalasi, Agent & LocalAgentConfig, personas, tools, policies, subagents, structured output (Pydantic), lifecycle/hooks, dan deploy agent lokal ke Vertex AI tanpa ubah kode.
id: antigravity-part-5-sdk
categories: AI, Developer Tools, Agentic Engineering, Google
tags: antigravity, google, gemini, sdk, python, vertex-ai, structured-output, policies, subagents
status: Published
authors: LearnWithFath Team
Feedback Link: https://github.com/learnwithfath/learnwithfath.github.io/issues

# Ekosistem Google Antigravity — Part 5: Antigravity SDK (Python)

## Outcome & Prasyarat
Duration: 4

Tiga surface sebelumnya adalah *aplikasi*. **SDK adalah library** — untuk saat Anda ingin membangun agent kustom sendiri, memasukkannya ke pipeline, atau menjalankannya di produksi.

Di akhir part ini:
* SDK terpasang dan Anda menjalankan agent pertama dari Python.
* Anda menguasai personas, tools, policies, subagents, dan structured output.
* Anda men-deploy agent yang sama ke Vertex AI tanpa mengubah kode.

**Prasyarat:** [Part 1](antigravity-part-1-konsep-ekosistem/) dipahami; Python 3 dan pip; untuk deployment, akses Google Cloud project.

## Kenapa SDK
Duration: 4

GUI dan CLI menjalankan agent *untuk* Anda. SDK membuat Anda **menulis agent-nya**: mengatur persona, mendaftarkan tool Python sendiri, menegakkan policy, dan memvalidasi output terhadap schema. Karena memakai tool & rules yang sama dengan surface lain, agent yang Anda tulis lokal bisa naik ke Google Cloud tanpa perubahan kode.

Positive
: Gunakan SDK saat Anda butuh **agent sebagai bagian dari sistem** — bukan alat interaktif. Contoh: pipeline CI yang mengklasifikasi issue, bot yang merapikan data, atau layanan internal ber-agent.

## Langkah 1: Instalasi & Agent Pertama
Duration: 7

```bash
pip install google-antigravity
export GEMINI_API_KEY="your_api_key_here"
```

Dua kelas inti: **`Agent`** (mengelola penemuan binary, eksekusi tool, dan daur hidup sesi lewat async context manager) dan **`LocalAgentConfig`** (konfigurasi).

```python
import asyncio
from google.antigravity import Agent, LocalAgentConfig

async def main():
    config = LocalAgentConfig()
    async with Agent(config) as agent:
        response = await agent.chat("What files are in the current directory?")
        print(await response.text())

if __name__ == "__main__":
    asyncio.run(main())
```

Positive
: `Agent` adalah **async context manager** (`async with`). Ini memastikan sesi & resource dibuka/ditutup rapi — pola yang sama dipakai saat men-deploy ke cloud.

## Langkah 2: Personas
Duration: 5

**Persona** menyetel perilaku agent lewat `system_instructions`:

```python
config = LocalAgentConfig(
    system_instructions="You are an expert assistant for codebase navigation. "
                        "Be concise and cite file paths."
)
```

Ini padanan programatik dari Rules/AGENTS.md pada surface lain — tetapi ditentukan langsung di kode agent Anda.

## Langkah 3: Tools & Skills
Duration: 7

Daftarkan **fungsi Python Anda sendiri** sebagai tool, dan muat skill bawaan (mis. akses filesystem). Ini yang membuat agent Anda melakukan hal spesifik domain — memanggil API internal, query database, atau menjalankan perhitungan.

Positive
: Prinsipnya sama dengan tool-use pada umumnya: deskripsi tool yang jelas menentukan apakah agent memanggilnya di saat yang tepat. Tulis docstring/deskripsi tool seakan untuk rekan kerja baru.

## Langkah 4: Policies (Kontrol Eksekusi)
Duration: 6

**Kenapa penting:** agent programatik berjalan tanpa Anda mengawasi tiap langkah. **Policies** menegakkan aturan eksekusi tool dan alur persetujuan interaktif — mana yang boleh otomatis, mana yang butuh approval.

Ini padanan SDK dari `/permissions` di CLI (`request-review` / `always-proceed` / `strict`). Terapkan *least privilege*: default ke persetujuan untuk aksi berisiko (tulis file di luar scope, akses jaringan, perintah destruktif).

Negative
: Jangan menjalankan agent SDK produksi dengan policy paling permisif "karena praktis". Aksi tak terkendali di pipeline otomatis jauh lebih sulit dibatalkan daripada di sesi interaktif.

## Langkah 5: Subagents & Structured Output
Duration: 8

**Subagents** — bangun sistem multi-agent dengan delegasi dan isolasi, sama seperti pola paralel di Desktop/CLI, tetapi Anda yang menyusun orkestrasinya di kode.

**Structured Output** — validasi respons terhadap **schema Pydantic** dan tangani input multimodal. Ini krusial untuk pipeline: Anda ingin data yang terjamin bentuknya, bukan teks bebas.

```python
from pydantic import BaseModel

class IssueTriage(BaseModel):
    severity: str      # low | medium | high | critical
    component: str
    needs_human: bool

# minta agent mengembalikan objek sesuai schema IssueTriage,
# lalu proses hasilnya secara deterministik di pipeline Anda.
```

Positive
: Structured output mengubah agent dari "penghasil teks" menjadi "komponen sistem yang dapat diandalkan". Kombinasikan dengan policies untuk pipeline produksi yang aman & dapat diprediksi.

## Langkah 6: Lifecycle & Hooks
Duration: 4

Kelola persistensi sesi dan pemicu event kustom (**hooks**) — mis. logging tiap tool call, atau menjalankan validasi setelah agent menghasilkan output. Ini padanan programatik dari Hooks pada surface lain.

## Langkah 7: Deploy ke Google Cloud (Vertex AI)
Duration: 7

Janji besar SDK: **kode yang sama** berjalan lokal maupun di Vertex AI/Gemini Enterprise — tanpa perubahan.

Cara 1 — lewat config:
```python
config = LocalAgentConfig(
    vertex=True,
    project="your-gcp-project",
    location="us-central1",
)
```

Cara 2 — lewat environment variable:
```bash
export GOOGLE_GENAI_USE_VERTEXAI=True
export GOOGLE_CLOUD_PROJECT="your-gcp-project"
export GOOGLE_CLOUD_LOCATION="us-central1"
gcloud auth application-default login
```

Positive
: Alur ideal: **tulis & uji lokal** dengan `GEMINI_API_KEY`, lalu **promosikan ke Vertex** dengan menyalakan `vertex=True` (atau env var) saat masuk produksi. Logika agent tidak berubah — hanya backend model-nya.

## Verifikasi
Duration: 2

- [ ] `pip install google-antigravity` sukses dan contoh agent pertama jalan.
- [ ] Anda menyetel **persona** dan mendaftarkan minimal satu **tool** Python.
- [ ] Anda menerapkan **policy** untuk aksi berisiko.
- [ ] Anda memvalidasi output dengan **schema Pydantic**.
- [ ] Anda menjalankan agent yang sama terhadap **Vertex AI** (config atau env var).

Positive
: **Lanjut ke Part 6 — Customizations, Governance & Ideal Workflow**, tempat kita menyatukan keempat surface menjadi satu alur kerja end-to-end.

## Sumber
Duration: 1

* [Antigravity Docs — SDK Overview](https://antigravity.google/docs/sdk/overview)
* [Choosing your surface — Google Cloud Blog](https://cloud.google.com/blog/topics/developers-practitioners/choosing-your-surface-antigravity-20-antigravity-cli-antigravity-ide-or-antigravity-sdk)
