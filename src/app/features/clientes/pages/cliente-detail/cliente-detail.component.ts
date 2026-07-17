import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Cliente } from '../../models/cliente.model';
import { ClienteService } from '../../services/cliente.service';

@Component({
  selector: 'app-cliente-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cliente-detail.component.html',
  styleUrl: './cliente-detail.component.css'
})
export class ClienteDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private clienteService = inject(ClienteService);
  private cdr = inject(ChangeDetectorRef);

  cliente: Cliente | null = null;
  loading = true;
  error = '';

  ngOnInit(): void {
    this.route.paramMap.subscribe({
      next: (params) => {
        const idParam = params.get('id');

        if (!idParam) {
          this.error = 'ID do cliente não informado.';
          this.loading = false;
          this.cdr.detectChanges();
          return;
        }

        const id = Number(idParam);

        if (Number.isNaN(id)) {
          this.error = 'ID do cliente inválido.';
          this.loading = false;
          this.cdr.detectChanges();
          return;
        }

        this.loading = true;
        this.error = '';
        this.cliente = null;
        this.cdr.detectChanges();

        this.clienteService.findById(id).subscribe({
          next: (data) => {
            this.cliente = data;
            this.loading = false;
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error('ERRO DETALHE:', err);
            this.error = 'Erro ao carregar cliente.';
            this.loading = false;
            this.cdr.detectChanges();
          }
        });
      },
      error: (err) => {
        console.error('ERRO PARAMS:', err);
        this.error = 'Erro ao ler parâmetros da rota.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}