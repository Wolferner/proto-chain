import chalk from 'chalk';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { stdin as input, stdout as output } from 'node:process';
import readline from 'node:readline';

// 🗂 Путь к файлу истории
const HISTORY_FILE = path.join(os.homedir(), '.proto_chain_cli_history');
const MAX_HISTORY = 1000;

// 📦 Загрузка истории
let history: string[] = [];
try {
  if (fs.existsSync(HISTORY_FILE)) {
    history = fs.readFileSync(HISTORY_FILE, 'utf-8').split('\n').filter(Boolean).reverse(); // порядок от последних к первым (readline ожидает так)
  }
} catch (err) {
  console.error(chalk.red('⚠️ Ошибка чтения истории:'), err instanceof Error ? err.message : 'Unknown error');
}

// 🟦 Приветствие
console.clear();
console.log(chalk.blueBright('🔷 Добро пожаловать в REPL-приложение с историей!'));
console.log(chalk.green('Введите команду (help — список доступных команд):\n'));

// 📘 Создание REPL-интерфейса
const rl = readline.createInterface({
  input,
  output,
  history, // загруженная история
  prompt: chalk.cyan('> '),
  historySize: MAX_HISTORY,
  removeHistoryDuplicates: true,
});

rl.prompt();

// 🔁 Основной REPL-обработчик
rl.on('line', line => {
  const input = line.trim();
  const [command, ...args] = input.split(/\s+/);

  switch (command) {
    case 'sum': {
      const [a, b] = args.map(Number);
      if (isNaN(a) || isNaN(b)) {
        console.log(chalk.red('❌ Ошибка: необходимо два числа.'));
      } else {
        const result = (a + b).toString();
        console.log(chalk.green(`✅ Сумма: ${result}`));
      }
      break;
    }

    case 'help': {
      console.log(chalk.yellow('\nДоступные команды:'));
      console.log(chalk.yellow('  sum <a> <b>') + ' — Сложить два числа');
      console.log(chalk.yellow('  exit, quit') + ' — Выйти из REPL');
      console.log(chalk.yellow('  help') + ' — Показать эту справку\n');
      break;
    }

    case 'exit':
    case 'quit': {
      console.log(chalk.blue('👋 До свидания!'));
      rl.close();
      return;
    }

    case '': {
      // пустая строка — игнор
      break;
    }

    default: {
      console.log(chalk.gray(`⚠️ Неизвестная команда: ${command}`));
      break;
    }
  }

  rl.prompt();
});

rl.on('history', lastHistory => {
  // Сохранение истории в файл
  try {
    const deduplicated = [...new Set(lastHistory.slice().reverse())];
    const trimmed = deduplicated.slice(-MAX_HISTORY).join('\n') + '\n';
    fs.writeFileSync(HISTORY_FILE, trimmed, 'utf-8');
  } catch (err) {
    console.error(chalk.red('⚠️ Ошибка сохранения истории:'), err instanceof Error ? err.message : 'Unknown error');
  }
});

// 📤 Обработка закрытия REPL — сохранение истории
rl.on('close', () => {
  process.exit(0);
});
