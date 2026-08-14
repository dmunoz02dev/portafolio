import { AfterViewInit, Component, signal } from '@angular/core';

interface PlanStep {
  step: string;
  description: string;
  time: string;
}
 
interface Plan {
  totalTime: string;
  steps: PlanStep[];
}

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements AfterViewInit {
  protected readonly title = 'portafolio';
 
  isGenerating = signal(false);
  plan = signal<Plan | null>(null);
 
  ngAfterViewInit(): void {
    if (typeof window === 'undefined') return;
 
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15 }
    );
 
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
  }
 
  generatePlan(textarea: HTMLTextAreaElement): void {
    const idea = textarea.value.trim();
    if (!idea || this.isGenerating()) return;
 
    this.isGenerating.set(true);
    this.plan.set(null);
 
    // TODO: reemplazar esta simulación por una llamada HTTP a tu propio backend
    // (ej. un endpoint de Django) que a su vez llame a la API de Anthropic con
    // tu API key protegida en el servidor. Nunca llames a la API de IA
    // directamente desde el navegador: la key quedaría expuesta públicamente.
    setTimeout(() => {
      this.plan.set(this.buildMockPlan(idea));
      this.isGenerating.set(false);
    }, 1000);
  }
 
  private buildMockPlan(idea: string): Plan {
    const complexity = Math.min(Math.max(Math.round(idea.length / 40), 1), 4);
 
    const steps: PlanStep[] = [
      {
        step: 'Descubrimiento',
        description: 'Definir alcance, usuarios y funcionalidades clave.',
        time: `${complexity} día(s)`,
      },
      {
        step: 'Diseño UI/UX',
        description: 'Wireframes y prototipo navegable.',
        time: `${complexity + 1} día(s)`,
      },
      {
        step: 'Backend',
        description: 'API, base de datos y lógica de negocio.',
        time: `${complexity * 2} semana(s)`,
      },
      {
        step: 'Frontend',
        description: 'Interfaz conectada a la API.',
        time: `${complexity * 2} semana(s)`,
      },
      {
        step: 'Pruebas y despliegue',
        description: 'QA, ajustes finales y publicación.',
        time: `${complexity} semana(s)`,
      },
    ];
 
    const totalWeeks = complexity * 5 + 1;
    return { totalTime: `${totalWeeks} semanas aprox.`, steps };
  }
}
