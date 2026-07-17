import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Cliente } from '../../models/cliente.model';
import { ClienteService } from '../../services/cliente.service';

@Component({
  selector: 'app-cliente-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './cliente-list.component.html',
  styleUrl: './cliente-list.component.css'
})
export class ClienteListComponent implements OnInit {
  private clienteService = inject(ClienteService);
  private cdr = inject(ChangeDetectorRef);

  clientes: Cliente[] = [];
  clientesFiltrados: Cliente[] = [];
  loading = true;
  error = '';

  searchTerm = '';

  currentPage = 1;
  pageSize = 10;
  visiblePages = 5;

  ngOnInit(): void {
    this.carregarClientes();
  }

  carregarClientes(): void {
    this.loading = true;
    this.error = '';

    this.clienteService.findAll().subscribe({
      next: (data) => {
        this.clientes = data;
        this.aplicarFiltro();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('ERRO CLIENTES:', err);
        this.error = 'Erro ao carregar clientes.';
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
      this.clientesFiltrados = [...this.clientes];
    } else {
      this.clientesFiltrados = this.clientes.filter((cliente) =>
        (cliente.nome ?? '').toLowerCase().includes(termo)
      );
    }

    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages || 1;
    }
  }

  excluir(id: number | undefined): void {
    if (!id) return;

    const confirmou = confirm('Deseja realmente excluir este cliente?');
    if (!confirmou) return;

    this.clienteService.delete(id).subscribe({
      next: () => this.carregarClientes(),
      error: (err) => {
        console.error('ERRO AO EXCLUIR:', err);
        this.error = 'Erro ao excluir cliente.';
        this.cdr.detectChanges();
      }
    });
  }

  get totalPages(): number {
    return Math.ceil(this.clientesFiltrados.length / this.pageSize);
  }

  get clientesPaginados(): Cliente[] {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.clientesFiltrados.slice(start, end);
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