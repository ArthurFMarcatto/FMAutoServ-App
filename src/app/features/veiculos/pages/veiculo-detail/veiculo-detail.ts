import { CommonModule, Location } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Veiculo } from '../../../models/veiculo.model';
import { VeiculoService } from '../../service/veiculo.service';

@Component({
  selector: 'app-veiculo-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './veiculo-detail.html',
  styleUrl: './veiculo-detail.css'
})
export class VeiculoDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private veiculoService = inject(VeiculoService);
  private cdr = inject(ChangeDetectorRef);
  private location = inject(Location);

  veiculo: Veiculo | null = null;
  loading = true;
  error = '';

  ngOnInit(): void {
    this.route.paramMap.subscribe({
      next: (params) => {
        const idParam = params.get('id');

        if (!idParam) {
          this.error = 'ID do veículo não informado.';
          this.loading = false;
          this.cdr.detectChanges();
          return;
        }

        const id = Number(idParam);

        if (Number.isNaN(id)) {
          this.error = 'ID do veículo inválido.';
          this.loading = false;
          this.cdr.detectChanges();
          return;
        }

        this.loading = true;
        this.error = '';
        this.veiculo = null;
        this.cdr.detectChanges();

        this.veiculoService.findById(id).subscribe({
          next: (data) => {
            this.veiculo = data;
            this.loading = false;
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error('ERRO DETALHE:', err);
            this.error = 'Erro ao carregar veículo.';
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

  voltar(): void {
    this.location.back();
  }
}