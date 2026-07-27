import { CommonModule, Location } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Cliente } from '../../../models/cliente.model';
import { Veiculo } from '../../../models/veiculo.model';
import { ClienteService } from '../../services/cliente.service';
import { VeiculoService } from '../../../veiculos/service/veiculo.service';

@Component({
  selector: 'app-cliente-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './cliente-detail.component.html',
  styleUrl: './cliente-detail.component.css'
})
export class ClienteDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private clienteService = inject(ClienteService);
  private veiculoService = inject(VeiculoService);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);
  private location = inject(Location);

  cliente: Cliente | null = null;
  loading = true;
  error = '';

  mostrarPopupVeiculos = false;
  mostrarFormNovoVeiculo = false;
  salvandoVeiculo = false;
  erroNovoVeiculo = '';

  novoVeiculoForm: FormGroup = this.fb.group({
    placa: ['', Validators.required],
    montadora: ['', Validators.required],
    modelo: ['', Validators.required],
    ano: [null, Validators.required],
    cor: ['', Validators.required],
  });

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

  abrirPopupVeiculos(): void {
    this.mostrarPopupVeiculos = true;
  }

  fecharPopupVeiculos(): void {
    this.mostrarPopupVeiculos = false;
    this.mostrarFormNovoVeiculo = false;
  }

  abrirFormNovoVeiculo(): void {
    this.mostrarFormNovoVeiculo = true;
    this.erroNovoVeiculo = '';
    this.novoVeiculoForm.reset();
  }

  cancelarNovoVeiculo(): void {
    this.mostrarFormNovoVeiculo = false;
    this.erroNovoVeiculo = '';
  }

  salvarNovoVeiculo(): void {
    if (this.novoVeiculoForm.invalid || !this.cliente?.idcliente) {
      return;
    }

    this.salvandoVeiculo = true;
    this.erroNovoVeiculo = '';

    const novoVeiculo: Veiculo = {
      ...this.novoVeiculoForm.value,
      idcliente: this.cliente.idcliente,
    };

    this.veiculoService.create(novoVeiculo).subscribe({
      next: (veiculoCriado) => {
        if (!this.cliente!.veiculos) {
          this.cliente!.veiculos = [];
        }
        this.cliente!.veiculos.push(veiculoCriado);
        this.mostrarFormNovoVeiculo = false;
        this.salvandoVeiculo = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('ERRO CADASTRO VEICULO:', err);
        this.erroNovoVeiculo = 'Erro ao cadastrar veículo. Tente novamente.';
        this.salvandoVeiculo = false;
        this.cdr.detectChanges();
      },
    });
  }
  voltar(): void {
    this.location.back();
  }
  abrirWhatsApp(): void {
    if (!this.cliente?.celular) {
      return;
    }

    const numeroLimpo = this.cliente.celular.replace(/\D/g, '');

    if (!numeroLimpo) {
      return;
    }

    const numeroWhatsapp = numeroLimpo.startsWith('55') ? numeroLimpo : `55${numeroLimpo}`;
    const mensagem = encodeURIComponent('Olá! Estou entrando em contato pelo FM AutoServ.');
    const url = `https://wa.me/${numeroWhatsapp}?text=${mensagem}`;

    window.open(url, '_blank');
  }
}