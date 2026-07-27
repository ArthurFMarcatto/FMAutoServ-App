import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Veiculo } from '../../../models/veiculo.model';
import { VeiculoService } from '../../service/veiculo.service';

@Component({
  selector: 'app-veiculo-list',
  standalone:true,
  imports: [CommonModule, FormsModule,RouterLink],
  templateUrl: './veiculo-list.html',
  styleUrl: './veiculo-list.css',
})
export class VeiculoListComponent implements OnInit{
  private veiculoService = inject(VeiculoService);
  private cdr = inject(ChangeDetectorRef);

  veiculos: Veiculo[] = [];
  veiculosFiltrados: Veiculo[] = [];
  loading = true;
  error = '';

  searchTerm = '';

  currentPage = 1;
  pageSize = 10;
  visiblePages = 5;

  ngOnInit(): void {
    this.carregarVeiculos();
  }

  carregarVeiculos(): void{
    this.loading = true;
    this.error = '';   
    
    this.veiculoService.findAll().subscribe({
      next: (data) => {
        this.veiculos = data;
        this.aplicarFiltro();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('ERRO VEICULOS:', err);
        this.error = 'Erro ao carregar veiculos.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
  pesquisar(): void {
    this.currentPage = 1;
    this.aplicarFiltro();
    this.cdr.detectChanges();
  }

  limparPesquisa(): void {
    this.searchTerm = '';
    this.currentPage = 1;
    this.aplicarFiltro();
    this.cdr.detectChanges();
  }

    aplicarFiltro(): void {
    const termo = this.searchTerm.trim().toLowerCase();

    if (!termo) {
      this.veiculosFiltrados = [...this.veiculos];
    } else {
      this.veiculosFiltrados = this.veiculos.filter((veiculo) =>
        (veiculo.placa ?? '').toLowerCase().includes(termo)
      );
    }

    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages || 1;
    }
  }

  excluir(id: number | undefined): void {
    if (!id) return;

    const confirmou = confirm('Deseja realmente excluir este veículo?');
    if (!confirmou) return;

    this.veiculoService.delete(id).subscribe({
      next: () => this.carregarVeiculos(),
      error: (err) => {
        console.error('ERRO AO EXCLUIR:', err);
        this.error = 'Erro ao excluir veículo.';
        this.cdr.detectChanges();
      }
    });
  }
  get totalPages(): number {
    return Math.ceil(this.veiculosFiltrados.length / this.pageSize);
  }

  get veiculosPaginados(): Veiculo[] {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.veiculosFiltrados.slice(start, end);
  }

  get pageNumbers(): number[] {
    const total = this.totalPages;
    if (total <= this.visiblePages) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    const half = Math.floor(this.visiblePages / 2);
    let start = Math.max(1, this.currentPage - half);
    let end = start + this.visiblePages - 1;

    if (end > total) {
      end = total;
      start = Math.max(1, end - this.visiblePages + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

    goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.cdr.detectChanges();
  }

  paginaAnterior(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.cdr.detectChanges();
    }
  }

  proximaPagina(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.cdr.detectChanges();
    }
  }
}
