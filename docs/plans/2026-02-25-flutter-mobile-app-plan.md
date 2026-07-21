# HızlıOkur Flutter Mobil App Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** React web uygulamasının birebir Flutter mobil karşılığını oluşturmak (Android + iOS).

**Architecture:** Riverpod state management, SQLite (sqflite) ile kitap depolama, SharedPreferences ile ayarlar. RSVP okuyucu mantığı web'den 1:1 taşınacak.

**Tech Stack:** Flutter 3.x, Dart, flutter_riverpod, sqflite, shared_preferences, file_picker, google_fonts

---

### Task 1: Flutter Projesi Oluştur

**Files:**
- Create: `f:/2026Projects/hizliokur_mobile/` (Flutter projesi)

**Step 1: Flutter projesi oluştur**

Run: `flutter create --org com.yunusemresalcan hizliokur_mobile`
(f:/2026Projects/ dizininde çalıştır)

**Step 2: Bağımlılıkları ekle**

`pubspec.yaml` dosyasında dependencies:

```yaml
dependencies:
  flutter:
    sdk: flutter
  flutter_riverpod: ^2.6.1
  shared_preferences: ^2.3.4
  sqflite: ^2.4.1
  path: ^1.9.0
  file_picker: ^8.1.6
  google_fonts: ^6.2.1

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^5.0.0
```

Run: `cd f:/2026Projects/hizliokur_mobile && flutter pub get`

**Step 3: Klasör yapısını oluştur**

```
lib/
  main.dart
  models/
    word_data.dart
    book.dart
    app_state.dart
  providers/
    reader_provider.dart
    settings_provider.dart
    books_provider.dart
  screens/
    home_screen.dart
    reader_screen.dart
    onboarding_screen.dart
  widgets/
    reader_display.dart
    controls.dart
    completion_overlay.dart
    book_card.dart
    text_input_sheet.dart
  services/
    database_service.dart
  utils/
    rsvp_utils.dart
  theme/
    app_theme.dart
```

**Step 4: Commit**

```bash
git add .
git commit -m "chore: initialize Flutter project with dependencies"
```

---

### Task 2: Tema ve Renk Sistemi

**Files:**
- Create: `lib/theme/app_theme.dart`

**Step 1: Tema dosyası oluştur**

```dart
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppColors {
  static const background = Color(0xFF0A0A0F);
  static const surface = Color(0xFF141419);
  static const surfaceHighlight = Color(0xFF1A1A22);
  static const primary = Color(0xFFFFFFFF);
  static const secondary = Color(0xFF8B8B9E);
  static const accent = Color(0xFFF97316);
}

class AppTheme {
  static ThemeData get dark => ThemeData(
    brightness: Brightness.dark,
    scaffoldBackgroundColor: AppColors.background,
    colorScheme: const ColorScheme.dark(
      surface: AppColors.surface,
      primary: AppColors.primary,
      secondary: AppColors.secondary,
    ),
    textTheme: GoogleFonts.plusJakartaSansTextTheme(
      ThemeData.dark().textTheme,
    ),
    useMaterial3: true,
  );
}
```

**Step 2: main.dart'ı güncelle**

```dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'theme/app_theme.dart';
import 'screens/home_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const ProviderScope(child: HizliOkurApp()));
}

class HizliOkurApp extends StatelessWidget {
  const HizliOkurApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'HızlıOkur',
      theme: AppTheme.dark,
      debugShowCheckedModeBanner: false,
      home: const HomeScreen(),
    );
  }
}
```

**Step 3: Commit**

```bash
git add .
git commit -m "feat: add dark theme and color system"
```

---

### Task 3: Modeller

**Files:**
- Create: `lib/models/word_data.dart`
- Create: `lib/models/book.dart`
- Create: `lib/models/app_state.dart`

**Step 1: WordData modeli**

```dart
class WordData {
  final String original;
  final String word;
  final String left;
  final String middle;
  final String right;
  final double delayMultiplier;

  const WordData({
    required this.original,
    required this.word,
    required this.left,
    required this.middle,
    required this.right,
    required this.delayMultiplier,
  });
}
```

**Step 2: Book modeli**

```dart
class Book {
  final String id;
  final String title;
  final String text;
  final int totalWords;
  final int progress;
  final int lastRead;
  final int wpm;
  final String? thumbnail;

  const Book({
    required this.id,
    required this.title,
    required this.text,
    required this.totalWords,
    this.progress = 0,
    required this.lastRead,
    this.wpm = 300,
    this.thumbnail,
  });

  Book copyWith({
    String? id, String? title, String? text,
    int? totalWords, int? progress, int? lastRead,
    int? wpm, String? thumbnail,
  }) => Book(
    id: id ?? this.id,
    title: title ?? this.title,
    text: text ?? this.text,
    totalWords: totalWords ?? this.totalWords,
    progress: progress ?? this.progress,
    lastRead: lastRead ?? this.lastRead,
    wpm: wpm ?? this.wpm,
    thumbnail: thumbnail ?? this.thumbnail,
  );

  Map<String, dynamic> toMap() => {
    'id': id, 'title': title, 'text': text,
    'totalWords': totalWords, 'progress': progress,
    'lastRead': lastRead, 'wpm': wpm, 'thumbnail': thumbnail,
  };

  factory Book.fromMap(Map<String, dynamic> map) => Book(
    id: map['id'] as String,
    title: map['title'] as String,
    text: map['text'] as String,
    totalWords: map['totalWords'] as int,
    progress: map['progress'] as int? ?? 0,
    lastRead: map['lastRead'] as int,
    wpm: map['wpm'] as int? ?? 300,
    thumbnail: map['thumbnail'] as String?,
  );
}
```

**Step 3: AppState enum**

```dart
enum ReaderState { idle, reading, paused, completed }
```

**Step 4: Commit**

```bash
git add .
git commit -m "feat: add data models"
```

---

### Task 4: RSVP Utility (Web'den Birebir Taşıma)

**Files:**
- Create: `lib/utils/rsvp_utils.dart`

**Step 1: RSVP fonksiyonları**

```dart
class RsvpUtils {
  static int getOrpIndex(int length) {
    if (length <= 1) return 0;
    if (length <= 5) return 1;
    if (length <= 9) return 2;
    if (length <= 13) return 3;
    return 4;
  }

  static List<WordData> processTextToWords(String text) {
    final rawWords = text.trim().split(RegExp(r'\s+'));
    return rawWords.map((word) {
      final length = word.length;
      final midIndex = getOrpIndex(length);
      final left = word.substring(0, midIndex);
      final middle = midIndex < word.length ? word[midIndex] : (word.isNotEmpty ? word[0] : '');
      final right = midIndex + 1 < word.length ? word.substring(midIndex + 1) : '';

      double delayMultiplier = 1.0;
      if (RegExp(r'[.,;!?]$').hasMatch(word)) delayMultiplier = 1.5;
      if (RegExp(r'[.!?]$').hasMatch(word)) delayMultiplier = 2.0;
      if (word.length > 8) delayMultiplier = 1.2;

      return WordData(
        original: word, word: word,
        left: left, middle: middle, right: right,
        delayMultiplier: delayMultiplier,
      );
    }).toList();
  }

  static int calculateDelay(int wpm, double multiplier) {
    final baseDelay = 60000 / wpm;
    return (baseDelay * multiplier).round();
  }
}
```

**Step 2: Commit**

```bash
git add .
git commit -m "feat: add RSVP utility functions"
```

---

### Task 5: Database Service

**Files:**
- Create: `lib/services/database_service.dart`

**Step 1: SQLite veritabanı servisi**

```dart
import 'package:sqflite/sqflite.dart';
import 'package:path/path.dart';
import '../models/book.dart';

class DatabaseService {
  static Database? _db;
  static const _maxBooks = 5;

  static Future<Database> get database async {
    _db ??= await _initDb();
    return _db!;
  }

  static Future<Database> _initDb() async {
    final path = join(await getDatabasesPath(), 'hizliokur.db');
    return openDatabase(path, version: 1, onCreate: (db, version) {
      return db.execute('''
        CREATE TABLE books(
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          text TEXT NOT NULL,
          totalWords INTEGER NOT NULL,
          progress INTEGER DEFAULT 0,
          lastRead INTEGER NOT NULL,
          wpm INTEGER DEFAULT 300,
          thumbnail TEXT
        )
      ''');
    });
  }

  static Future<List<Book>> getBooks() async {
    final db = await database;
    final maps = await db.query('books', orderBy: 'lastRead DESC');
    return maps.map((m) => Book.fromMap(m)).toList();
  }

  static Future<void> saveBook(Book book) async {
    final db = await database;
    await db.insert('books', book.toMap(),
      conflictAlgorithm: ConflictAlgorithm.replace);
    // Enforce max books limit
    final all = await db.query('books', orderBy: 'lastRead DESC');
    if (all.length > _maxBooks) {
      final toDelete = all.sublist(_maxBooks);
      for (final row in toDelete) {
        await db.delete('books', where: 'id = ?', whereArgs: [row['id']]);
      }
    }
  }

  static Future<void> updateProgress(String id, int progress) async {
    final db = await database;
    await db.update('books',
      {'progress': progress, 'lastRead': DateTime.now().millisecondsSinceEpoch},
      where: 'id = ?', whereArgs: [id]);
  }

  static Future<void> deleteBook(String id) async {
    final db = await database;
    await db.delete('books', where: 'id = ?', whereArgs: [id]);
  }
}
```

**Step 2: Commit**

```bash
git add .
git commit -m "feat: add SQLite database service"
```

---

### Task 6: Riverpod Providers

**Files:**
- Create: `lib/providers/settings_provider.dart`
- Create: `lib/providers/books_provider.dart`
- Create: `lib/providers/reader_provider.dart`

**Step 1: Settings provider**

```dart
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';

class SettingsState {
  final int wpm;
  final int fontSize;
  const SettingsState({this.wpm = 300, this.fontSize = 3});
  SettingsState copyWith({int? wpm, int? fontSize}) =>
    SettingsState(wpm: wpm ?? this.wpm, fontSize: fontSize ?? this.fontSize);
}

class SettingsNotifier extends StateNotifier<SettingsState> {
  SettingsNotifier() : super(const SettingsState()) { _load(); }

  Future<void> _load() async {
    final prefs = await SharedPreferences.getInstance();
    final wpm = prefs.getInt('wpm') ?? 300;
    final fontSize = prefs.getInt('fontSize') ?? 3;
    state = SettingsState(wpm: wpm, fontSize: fontSize);
  }

  Future<void> setWpm(int val) async {
    state = state.copyWith(wpm: val);
    (await SharedPreferences.getInstance()).setInt('wpm', val);
  }

  Future<void> setFontSize(int val) async {
    state = state.copyWith(fontSize: val);
    (await SharedPreferences.getInstance()).setInt('fontSize', val);
  }
}

final settingsProvider = StateNotifierProvider<SettingsNotifier, SettingsState>(
  (ref) => SettingsNotifier(),
);
```

**Step 2: Books provider**

```dart
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/book.dart';
import '../services/database_service.dart';

class BooksNotifier extends StateNotifier<List<Book>> {
  BooksNotifier() : super([]) { load(); }

  Future<void> load() async {
    state = await DatabaseService.getBooks();
  }

  Future<void> addBook(Book book) async {
    await DatabaseService.saveBook(book);
    await load();
  }

  Future<void> deleteBook(String id) async {
    await DatabaseService.deleteBook(id);
    await load();
  }

  Future<void> updateProgress(String id, int progress) async {
    await DatabaseService.updateProgress(id, progress);
    await load();
  }
}

final booksProvider = StateNotifierProvider<BooksNotifier, List<Book>>(
  (ref) => BooksNotifier(),
);
```

**Step 3: Reader provider**

```dart
import 'dart:async';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/app_state.dart';
import '../models/word_data.dart';
import '../utils/rsvp_utils.dart';

class ReaderNotifierState {
  final ReaderState state;
  final List<WordData> words;
  final int currentIndex;
  final String? bookId;
  final int elapsedSeconds;

  const ReaderNotifierState({
    this.state = ReaderState.idle,
    this.words = const [],
    this.currentIndex = 0,
    this.bookId,
    this.elapsedSeconds = 0,
  });

  double get progress => words.isEmpty ? 0 : (currentIndex / words.length) * 100;
  WordData? get currentWord => words.isNotEmpty && currentIndex < words.length
    ? words[currentIndex] : null;

  ReaderNotifierState copyWith({
    ReaderState? state, List<WordData>? words, int? currentIndex,
    String? bookId, int? elapsedSeconds, bool clearBookId = false,
  }) => ReaderNotifierState(
    state: state ?? this.state,
    words: words ?? this.words,
    currentIndex: currentIndex ?? this.currentIndex,
    bookId: clearBookId ? null : (bookId ?? this.bookId),
    elapsedSeconds: elapsedSeconds ?? this.elapsedSeconds,
  );
}

class ReaderNotifier extends StateNotifier<ReaderNotifierState> {
  ReaderNotifier() : super(const ReaderNotifierState());
  Timer? _timer;
  Timer? _elapsedTimer;
  DateTime? _readingStart;
  double _accumulatedSeconds = 0;

  void startReading(String text, int wpm, {String? bookId, int initialIndex = 0}) {
    _timer?.cancel();
    _elapsedTimer?.cancel();
    final words = RsvpUtils.processTextToWords(text);
    _accumulatedSeconds = 0;
    state = ReaderNotifierState(
      state: ReaderState.reading,
      words: words,
      currentIndex: initialIndex,
      bookId: bookId,
      elapsedSeconds: 0,
    );
    _startTimers(wpm);
  }

  void togglePlay(int wpm) {
    if (state.state == ReaderState.reading) {
      _pause();
    } else if (state.state == ReaderState.paused || state.state == ReaderState.completed) {
      var idx = state.currentIndex;
      if (idx >= state.words.length - 1) idx = 0;
      state = state.copyWith(state: ReaderState.reading, currentIndex: idx);
      _startTimers(wpm);
    }
  }

  void _pause() {
    _timer?.cancel();
    _elapsedTimer?.cancel();
    _accumulatedSeconds += DateTime.now().difference(_readingStart ?? DateTime.now()).inMilliseconds / 1000;
    state = state.copyWith(state: ReaderState.paused);
  }

  void _startTimers(int wpm) {
    _readingStart = DateTime.now();
    _elapsedTimer = Timer.periodic(const Duration(milliseconds: 500), (_) {
      final total = _accumulatedSeconds + DateTime.now().difference(_readingStart!).inMilliseconds / 1000;
      state = state.copyWith(elapsedSeconds: total.round());
    });
    _scheduleNext(wpm);
  }

  void _scheduleNext(int wpm) {
    _timer?.cancel();
    if (state.state != ReaderState.reading) return;
    if (state.currentIndex >= state.words.length) {
      _complete();
      return;
    }
    final delay = RsvpUtils.calculateDelay(wpm, state.words[state.currentIndex].delayMultiplier);
    _timer = Timer(Duration(milliseconds: delay), () {
      if (state.currentIndex < state.words.length - 1) {
        state = state.copyWith(currentIndex: state.currentIndex + 1);
        _scheduleNext(wpm);
      } else {
        _complete();
      }
    });
  }

  void _complete() {
    _timer?.cancel();
    _elapsedTimer?.cancel();
    _accumulatedSeconds += DateTime.now().difference(_readingStart ?? DateTime.now()).inMilliseconds / 1000;
    state = state.copyWith(
      state: ReaderState.completed,
      elapsedSeconds: _accumulatedSeconds.round(),
    );
  }

  void skip(int amount) {
    final newIndex = (state.currentIndex + amount).clamp(0, state.words.length - 1);
    state = state.copyWith(currentIndex: newIndex);
  }

  void reset(int wpm) {
    _timer?.cancel();
    _elapsedTimer?.cancel();
    _accumulatedSeconds = 0;
    state = state.copyWith(
      state: ReaderState.paused,
      currentIndex: 0,
      elapsedSeconds: 0,
    );
  }

  void back() {
    _timer?.cancel();
    _elapsedTimer?.cancel();
    _accumulatedSeconds = 0;
    state = const ReaderNotifierState();
  }

  @override
  void dispose() {
    _timer?.cancel();
    _elapsedTimer?.cancel();
    super.dispose();
  }
}

final readerProvider = StateNotifierProvider<ReaderNotifier, ReaderNotifierState>(
  (ref) => ReaderNotifier(),
);
```

**Step 4: Commit**

```bash
git add .
git commit -m "feat: add Riverpod providers for settings, books, and reader"
```

---

### Task 7: ReaderDisplay Widget

**Files:**
- Create: `lib/widgets/reader_display.dart`

**Step 1: ORP kelime gösterimi widget'ı**

Web'deki `ReaderDisplay.tsx` bileşeninin birebir karşılığı. Sol|pivot|sağ yapısı, dikey guide çizgileri, font boyutu ayarı.

Mono font kullan (JetBrains Mono veya Roboto Mono).

**Step 2: Commit**

```bash
git add .
git commit -m "feat: add ReaderDisplay widget with ORP visualization"
```

---

### Task 8: Controls Widget

**Files:**
- Create: `lib/widgets/controls.dart`

**Step 1: Alt kontrol barı**

Web'deki `Controls.tsx`'in karşılığı:
- Pill şeklinde bar (rounded-full)
- Sol: geri (X), ayarlar (dişli) butonları
- Orta: skip back, play/pause, skip forward
- Alt: ilerleme barı + kelime sayısı + kalan süre
- Ayarlar bottom sheet: WPM slider, font boyutu seçici

**Step 2: Commit**

```bash
git add .
git commit -m "feat: add Controls widget with settings panel"
```

---

### Task 9: CompletionOverlay Widget

**Files:**
- Create: `lib/widgets/completion_overlay.dart`

**Step 1: Tamamlanma ekranı**

Web'deki `CompletionScreen.tsx`'in karşılığı:
- Trophy ikonu
- 3 stat kartı: kelime, süre, WPM
- "Yeniden Oku" ve "Kütüphaneye Dön" butonları

**Step 2: Commit**

```bash
git add .
git commit -m "feat: add CompletionOverlay widget"
```

---

### Task 10: HomeScreen (Kütüphane)

**Files:**
- Create: `lib/screens/home_screen.dart`
- Create: `lib/widgets/book_card.dart`
- Create: `lib/widgets/text_input_sheet.dart`

**Step 1: Ana ekran**

- Üst: "HızlıOkur" başlık + AI badge
- "Son Okunanlar" bölümü: 3-sütun grid, kitap kartları (thumbnail, başlık, ilerleme)
- "Yeni Okuma" bölümü: Metin/PDF sekmeleri
- Metin sekmesi: textarea, yapıştır butonu, "Başla" butonu
- PDF sekmesi: file_picker ile PDF yükleme
- Swipe-to-delete (Dismissible) kitap kartlarında

**Step 2: TextInputSheet**

Bottom sheet olarak: metin girişi, yapıştır, başla.

**Step 3: Commit**

```bash
git add .
git commit -m "feat: add HomeScreen with library and text input"
```

---

### Task 11: ReaderScreen

**Files:**
- Create: `lib/screens/reader_screen.dart`

**Step 1: Okuyucu ekranı**

- Tam ekran, koyu arka plan
- ReaderDisplay widget (ortada)
- Controls widget (alt)
- CompletionOverlay (tamamlandığında)
- WPM değişince reader'ı güncelle
- İlerleme kaydetme (debounced)

**Step 2: Commit**

```bash
git add .
git commit -m "feat: add ReaderScreen with full reading flow"
```

---

### Task 12: Onboarding

**Files:**
- Create: `lib/screens/onboarding_screen.dart`

**Step 1: Onboarding ekranı**

- PageView ile 3 sayfa
- Her sayfa: başlık, alt başlık, ileri butonu
- Son sayfada "Başla" butonu
- SharedPreferences ile "görüldü" kaydı
- Web'deki orbit animasyonlarının basitleştirilmiş versiyonu

**Step 2: main.dart'ı güncelle**

İlk açılışta onboarding → home geçişi.

**Step 3: Commit**

```bash
git add .
git commit -m "feat: add onboarding screen"
```

---

### Task 13: PDF Desteği

**Files:**
- Modify: `lib/screens/home_screen.dart`
- Modify: `pubspec.yaml` (syncfusion_flutter_pdf veya pdfx ekle)

**Step 1: PDF metin çıkarma**

file_picker ile PDF seç → metin çıkar → Book olarak kaydet → okumaya başla.

**Step 2: Commit**

```bash
git add .
git commit -m "feat: add PDF text extraction support"
```

---

### Task 14: Son Dokunuşlar ve Test

**Step 1: Android/iOS ikonları ve splash screen ayarla**

**Step 2: Tüm akışı test et**
- Metin girişi → okuma → tamamlanma
- PDF yükleme → okuma
- İlerleme kaydetme/yükleme
- WPM ve font boyutu ayarları
- Onboarding akışı

**Step 3: Commit**

```bash
git add .
git commit -m "feat: finalize app with icons and testing"
```
